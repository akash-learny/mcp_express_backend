// mcp/assets-mcp/assetsmcp.js
import Asset from "../../models/assets.js";
import { z } from "zod";

// Import CRUD modules for Assets
import {
  createAsset,
  createAssetSchema,
} from "./CreateAsset.js";
import {
  getAsset,
  listAssets,
  getAssetSchema,
} from "./GetAsset.js";
import {
  updateAsset,
  updateAssetSchema,
} from "./UpdateAsset.js";
import {
  deleteAsset,
  softDeleteAsset,
  deleteAssetSchema,
} from "./DeleteAsset.js";


export default function registerAssetMcp(server) {
  server.resource("assets", {
    // List all assets
    async list() {
      return await listAssets({ includeDeleted: false });
    },

    // Get single asset by id
    async get({ id }) {
      return await getAsset(id);
    },

    // Create new asset
    async create({ data }) {
      return await createAsset(data);
    },

    // Update existing asset
    async update({ id, data }) {
      return await updateAsset(id, data);
    },

    // Delete asset
    async delete({ id }) {
      return await deleteAsset(id);
    },
  });


  // TOOL: Search Assets

  server.registerTool(
    "assets-mcp-search",
    {
      description:
        "Query the Asset collection using optional filters such as organisationId, status, or name.",
      inputSchema: {
        organisationId: z
          .string()
          .optional()
          .describe("Filter by organisation ObjectId."),
        instituteId: z
          .string()
          .optional()
          .describe("Filter by institute ObjectId."),
        departmentId: z
          .union([z.string(), z.array(z.string())])
          .optional()
          .describe(
            "Filter by one or more department ObjectIds (matches any)."
          ),
        laboratoryId: z
          .union([z.string(), z.array(z.string())])
          .optional()
          .describe(
            "Filter by one or more laboratory ObjectIds (matches any)."
          ),
        status: z.string().optional().describe("Filter by asset status."),
        name: z
          .string()
          .optional()
          .describe("Case-insensitive substring match on the asset name."),
        includeDeleted: z
          .boolean()
          .optional()
          .describe(
            "Set true to include assets where isDeleted=true. Defaults to false."
          ),
        limit: z
          .number()
          .int()
          .min(1)
          .max(100)
          .optional()
          .describe(
            "Maximum number of results to return. Defaults to 20, maximum 100."
          ),
      },
    },
    async (args = {}) => {
      const {
        organisationId,
        instituteId,
        departmentId,
        laboratoryId,
        status,
        name,
        includeDeleted = false,
        limit = 20,
      } = args;

      const normalizedLimit = Math.min(Math.max(limit, 1), 100);
      const query = {};

      if (!includeDeleted) {
        query.isDeleted = false;
      }
      if (organisationId) query.organisationId = organisationId;
      if (instituteId) query.instituteId = instituteId;
      if (status) query.status = status;
      if (name) query.name = { $regex: name, $options: "i" };

      const normalizeArrayFilter = (value) => {
        if (Array.isArray(value)) return value.filter(Boolean);
        if (typeof value === "string" && value.trim() !== "") return [value];
        return undefined;
      };

      const departmentFilter = normalizeArrayFilter(departmentId);
      if (departmentFilter) {
        query.departmentId = { $in: departmentFilter };
      }

      const laboratoryFilter = normalizeArrayFilter(laboratoryId);
      if (laboratoryFilter) {
        query.laboratoryId = { $in: laboratoryFilter };
      }

      const assets = await Asset.find(query)
        .limit(normalizedLimit)
        .lean()
        .exec();

      if (!assets.length) {
        return {
          content: [
            {
              type: "text",
              text: "No assets matched the provided filters.",
            },
          ],
        };
      }

      const formatArray = (value) =>
        Array.isArray(value) && value.length
          ? value.join(", ")
          : value
            ? String(value)
            : "N/A";

      const summary = assets.map((asset) => {
        const fields = [
          `id: ${asset._id}`,
          `name: ${asset.name ?? "(unnamed)"}`,
          `status: ${asset.status ?? "N/A"}`,
          `assetNumber: ${asset.assetNumber ?? "N/A"}`,
          `organisationId: ${asset.organisationId ?? "N/A"}`,
          `departmentId: ${formatArray(asset.departmentId)}`,
          `laboratoryId: ${formatArray(asset.laboratoryId)}`,
          `instituteId: ${asset.instituteId ?? "N/A"}`,
          `purchasedDate: ${asset.purchasedDate ?? "N/A"}`,
          `lastUsedDate: ${asset.lastUsedDate ?? "N/A"}`,
          `availability: ${asset.availability ?? "N/A"}`,
          `expiryDate: ${asset.expiryDate ?? "N/A"}`,
          `isActive: ${asset.isActive}`,
          `isDeleted: ${asset.isDeleted}`,
          `createdAt: ${asset.createdAt}`,
          `updatedAt: ${asset.updatedAt}`,
        ];

        return fields.join("\n");
      });

      return {
        content: [
          {
            type: "text",
            text: summary.join("\n\n---\n\n"),
          },
        ],
      };
    }
  );

  // TOOL: Create Asset
  server.registerTool(
    "assets-mcp-create",
    {
      description: "Create a new asset in the database.",
      inputSchema: createAssetSchema,
    },
    async (args = {}) => {
      try {
        const result = await createAsset(args);
        return {
          content: [
            {
              type: "text",
              text: `Asset created successfully!\n\nID: ${result.id}\nName: ${result.asset.name ?? "N/A"}\nAsset Number: ${result.asset.assetNumber ?? "N/A"}\nStatus: ${result.asset.status ?? "N/A"}\nOrganisation ID: ${result.asset.organisationId}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating asset: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // TOOL: Get Asset
  server.registerTool(
    "assets-mcp-get",
    {
      description: "Retrieve a single asset by its ID.",
      inputSchema: getAssetSchema,
    },
    async (args = {}) => {
      try {
        const asset = await getAsset(args.id);
        const formatArray = (value) =>
          Array.isArray(value) && value.length
            ? value.join(", ")
            : value
              ? String(value)
              : "N/A";

        return {
          content: [
            {
              type: "text",
              text: `Asset Details:\n\nID: ${asset.id}\nName: ${asset.name ?? "N/A"}\nAsset Number: ${asset.assetNumber ?? "N/A"}\nStatus: ${asset.status ?? "N/A"}\nOrganisation ID: ${asset.organisationId ?? "N/A"}\nInstitute ID: ${asset.instituteId ?? "N/A"}\nDepartment ID(s): ${formatArray(asset.departmentId)}\nLaboratory ID(s): ${formatArray(asset.laboratoryId)}\nPurchased Date: ${asset.purchasedDate ?? "N/A"}\nLast Used Date: ${asset.lastUsedDate ?? "N/A"}\nAvailability: ${asset.availability ?? "N/A"}\nExpiry Date: ${asset.expiryDate ?? "N/A"}\nIs Active: ${asset.isActive}\nIs Deleted: ${asset.isDeleted}\nCreated At: ${asset.createdAt}\nUpdated At: ${asset.updatedAt}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error retrieving asset: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // TOOL: Update Asset
  server.registerTool(
    "assets-mcp-update",
    {
      description: "Update an existing asset by ID.",
      inputSchema: updateAssetSchema,
    },
    async (args = {}) => {
      try {
        const { id, ...updateData } = args;
        if (!id) {
          return {
            content: [
              {
                type: "text",
                text: "Error: Asset ID is required for update.",
              },
            ],
            isError: true,
          };
        }

        const result = await updateAsset(id, updateData);
        return {
          content: [
            {
              type: "text",
              text: `Asset updated successfully!\n\nID: ${result.id}\nName: ${result.asset.name ?? "N/A"}\nAsset Number: ${result.asset.assetNumber ?? "N/A"}\nStatus: ${result.asset.status ?? "N/A"}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error updating asset: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // TOOL: Delete Asset
  server.registerTool(
    "assets-mcp-delete",
    {
      description:
        "Delete an asset by ID. Supports both hard delete and soft delete (sets isDeleted=true).",
      inputSchema: deleteAssetSchema,
    },
    async (args = {}) => {
      try {
        const { id, softDelete = false } = args;
        if (!id) {
          return {
            content: [
              {
                type: "text",
                text: "Error: Asset ID is required for deletion.",
              },
            ],
            isError: true,
          };
        }

        const result = softDelete
          ? await softDeleteAsset(id)
          : await deleteAsset(id);

        return {
          content: [
            {
              type: "text",
              text: `${result.message}\n\nAsset ID: ${result.id}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error deleting asset: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Return registration info for server.js to display
  return {
    resource: "assets",
    tools: [
      "assets-mcp-search",
      "assets-mcp-create",
      "assets-mcp-get",
      "assets-mcp-update",
      "assets-mcp-delete"
    ]
  };
}


// mcp/assets-mcp/CreateAsset.js
import Asset from "../../models/assets.js";
import { z } from "zod";

/**
 * Creates a new asset in the database.
 * @param {Object} data - Asset data to create
 * @returns {Object} Created asset information
 */
export async function createAsset(data) {
  try {
    // Validate required fields
    if (!data.organisationId) {
      throw new Error("organisationId is required");
    }

    const newAsset = new Asset(data);
    await newAsset.save();

    return {
      id: newAsset._id.toString(),
      message: "Asset created successfully",
      asset: {
        id: newAsset._id.toString(),
        name: newAsset.name,
        assetNumber: newAsset.assetNumber,
        status: newAsset.status,
        organisationId: newAsset.organisationId?.toString(),
        departmentId: newAsset.departmentId?.map((d) => d.toString()),
        laboratoryId: newAsset.laboratoryId?.map((l) => l.toString()),
        instituteId: newAsset.instituteId?.toString(),
        purchasedDate: newAsset.purchasedDate,
        lastUsedDate: newAsset.lastUsedDate,
        isActive: newAsset.isActive,
        isDeleted: newAsset.isDeleted,
        createdAt: newAsset.createdAt,
        updatedAt: newAsset.updatedAt,
      },
    };
  } catch (error) {
    throw new Error(`Failed to create asset: ${error.message}`);
  }
}

/**
 * Zod schema for CreateAsset tool input validation
 */
export const createAssetSchema = {
  name: z.string().optional().describe("Asset name"),
  assetNumber: z.string().optional().describe("Unique asset number"),
  organisationId: z
    .string()
    .describe("Organisation ObjectId (required)"),
  instituteId: z.string().optional().describe("Institute ObjectId"),
  departmentId: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .describe("Department ObjectId(s)"),
  laboratoryId: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .describe("Laboratory ObjectId(s)"),
  status: z.string().optional().describe("Asset status"),
  purchasedDate: z.string().optional().describe("Purchase date"),
  lastUsedDate: z.string().optional().describe("Last used date"),
  availability: z.string().optional().describe("Asset availability"),
  expiryDate: z.string().optional().describe("Expiry date"),
  isActive: z.boolean().optional().describe("Whether asset is active (default: true)"),
};


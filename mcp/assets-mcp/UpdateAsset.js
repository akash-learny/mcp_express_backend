// mcp/assets-mcp/UpdateAsset.js
import Asset from "../../models/assets.js";
import { z } from "zod";

/**
 * Updates an existing asset by ID.
 * @param {string} id - Asset ID to update
 * @param {Object} data - Updated asset data
 * @returns {Object} Updated asset information
 */
export async function updateAsset(id, data) {
  try {
    const updated = await Asset.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      throw new Error("Asset not found");
    }

    return {
      id: updated._id.toString(),
      message: "Asset updated successfully",
      asset: {
        id: updated._id.toString(),
        name: updated.name,
        assetNumber: updated.assetNumber,
        status: updated.status,
        organisationId: updated.organisationId?.toString(),
        departmentId: updated.departmentId?.map((d) => d.toString()),
        laboratoryId: updated.laboratoryId?.map((l) => l.toString()),
        instituteId: updated.instituteId?.toString(),
        purchasedDate: updated.purchasedDate,
        lastUsedDate: updated.lastUsedDate,
        availability: updated.availability,
        expiryDate: updated.expiryDate,
        isActive: updated.isActive,
        isDeleted: updated.isDeleted,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      },
    };
  } catch (error) {
    throw new Error(`Failed to update asset: ${error.message}`);
  }
}

/**
 * Zod schema for UpdateAsset tool input validation
 */
export const updateAssetSchema = {
  id: z.string().describe("Asset ObjectId to update"),
  name: z.string().optional().describe("Asset name"),
  assetNumber: z.string().optional().describe("Unique asset number"),
  organisationId: z.string().optional().describe("Organisation ObjectId"),
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
  isActive: z.boolean().optional().describe("Whether asset is active"),
  isDeleted: z.boolean().optional().describe("Whether asset is deleted"),
};


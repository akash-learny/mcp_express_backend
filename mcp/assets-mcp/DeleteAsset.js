// mcp/assets-mcp/DeleteAsset.js
import Asset from "../../models/assets.js";
import { z } from "zod";

/**
 * Deletes an asset by ID (hard delete).
 * @param {string} id - Asset ID to delete
 * @returns {Object} Deletion confirmation
 */
export async function deleteAsset(id) {
  try {
    const deleted = await Asset.findByIdAndDelete(id);
    if (!deleted) {
      throw new Error("Asset not found");
    }

    return {
      message: "Asset deleted successfully",
      id: deleted._id.toString(),
    };
  } catch (error) {
    throw new Error(`Failed to delete asset: ${error.message}`);
  }
}

/**
 * Soft deletes an asset by setting isDeleted to true.
 * @param {string} id - Asset ID to soft delete
 * @returns {Object} Soft deletion confirmation
 */
export async function softDeleteAsset(id) {
  try {
    const updated = await Asset.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!updated) {
      throw new Error("Asset not found");
    }

    return {
      message: "Asset soft deleted successfully",
      id: updated._id.toString(),
    };
  } catch (error) {
    throw new Error(`Failed to soft delete asset: ${error.message}`);
  }
}

/**
 * Zod schema for DeleteAsset tool input validation
 */
export const deleteAssetSchema = {
  id: z.string().describe("Asset ObjectId to delete"),
  softDelete: z
    .boolean()
    .optional()
    .describe("If true, performs soft delete (sets isDeleted=true). Default: false (hard delete)"),
};


// mcp/assets-mcp/GetAsset.js
import Asset from "../../models/assets.js";
import { z } from "zod";

/**
 * Retrieves a single asset by ID.
 * @param {string} id - Asset ID
 * @returns {Object} Asset data
 */
export async function getAsset(id) {
  try {
    const asset = await Asset.findById(id).lean();
    if (!asset) {
      throw new Error("Asset not found");
    }

    return {
      id: asset._id.toString(),
      name: asset.name,
      assetNumber: asset.assetNumber,
      status: asset.status,
      organisationId: asset.organisationId?.toString(),
      departmentId: asset.departmentId?.map((d) => d.toString()),
      laboratoryId: asset.laboratoryId?.map((l) => l.toString()),
      instituteId: asset.instituteId?.toString(),
      purchasedDate: asset.purchasedDate,
      lastUsedDate: asset.lastUsedDate,
      availability: asset.availability,
      expiryDate: asset.expiryDate,
      isActive: asset.isActive,
      isDeleted: asset.isDeleted,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
    };
  } catch (error) {
    throw new Error(`Failed to get asset: ${error.message}`);
  }
}

/**
 * Lists all assets with optional filtering.
 * @param {Object} filters - Filter options
 * @returns {Object} List of assets
 */
export async function listAssets(filters = {}) {
  try {
    const { includeDeleted = false } = filters;
    const query = includeDeleted ? {} : { isDeleted: false };

    const assets = await Asset.find(query).lean();

    return {
      items: assets.map((a) => ({
        id: a._id.toString(),
        name: a.name,
        assetNumber: a.assetNumber,
        status: a.status,
        organisationId: a.organisationId?.toString(),
        departmentId: a.departmentId?.map((d) => d.toString()),
        laboratoryId: a.laboratoryId?.map((l) => l.toString()),
        instituteId: a.instituteId?.toString(),
        purchasedDate: a.purchasedDate,
        lastUsedDate: a.lastUsedDate,
        isActive: a.isActive,
        isDeleted: a.isDeleted,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
    };
  } catch (error) {
    throw new Error(`Failed to list assets: ${error.message}`);
  }
}

/**
 * Zod schema for GetAsset tool input validation
 */
export const getAssetSchema = {
  id: z.string().describe("Asset ObjectId to retrieve"),
};

/**
 * Zod schema for ListAssets tool input validation
 */
export const listAssetsSchema = {
  includeDeleted: z
    .boolean()
    .optional()
    .describe("Include deleted assets (default: false)"),
};


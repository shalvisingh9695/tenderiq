import mongoose from 'mongoose';
import { SAMPLE_TENDERS_BACKEND } from '../data/sampleTenders.js';

const TenderSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    name: { type: String, default: '' },
    originalName: { type: String, default: '' },
    size: { type: Number, default: 0 },
    sizeFormatted: { type: String, default: '' },
    mimeType: { type: String, default: 'application/pdf' },
    extension: { type: String, default: '.pdf' },
    uploadedAt: { type: Date, default: Date.now },
    status: { type: String, default: 'uploaded' },
    previewSnippet: { type: String, default: '' },
    filePath: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    extractedText: { type: String, default: '' },
    analysisStatus: { type: String, default: 'ready' },
    analyzedAt: { type: Date, default: null },
    analysisError: { type: String, default: null },
    structuredAnalysis: { type: mongoose.Schema.Types.Mixed, default: null },
    riskStatus: { type: String, default: 'not_started' },
    riskAnalyzedAt: { type: Date, default: null },
    riskError: { type: String, default: null },
    riskReport: { type: mongoose.Schema.Types.Mixed, default: null },
    decisionStatus: { type: String, default: 'not_started' },
    decisionEvaluatedAt: { type: Date, default: null },
    decisionReport: { type: mongoose.Schema.Types.Mixed, default: null },
    companyProfileSnapshot: { type: mongoose.Schema.Types.Mixed, default: null },
    extractedData: { type: mongoose.Schema.Types.Mixed, default: null },
    riskScore: { type: mongoose.Schema.Types.Mixed, default: null },
    decisionResult: { type: mongoose.Schema.Types.Mixed, default: null }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Prevent mongoose overwrite model error on hot reloads
export const Tender = mongoose.models.Tender || mongoose.model('Tender', TenderSchema);

// In-memory cache for fast local testing when MONGODB_URI is not supplied
const memoryStore = new Map();

// Seed initial sample tenders
for (const sample of SAMPLE_TENDERS_BACKEND) {
  memoryStore.set(sample.id, { ...sample, uploadedAt: sample.uploadedAt || new Date().toISOString() });
}

export class TenderModel {
  static isMongoConnected() {
    return mongoose.connection.readyState === 1;
  }

  static async save(tenderData) {
    if (this.isMongoConnected()) {
      const doc = await Tender.findOneAndUpdate(
        { id: tenderData.id },
        { $set: tenderData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).lean();
      memoryStore.set(tenderData.id, doc);
      return doc;
    }

    memoryStore.set(tenderData.id, tenderData);
    return tenderData;
  }

  static async findAll() {
    if (this.isMongoConnected()) {
      try {
        const docs = await Tender.find().sort({ uploadedAt: -1 }).lean();
        if (docs && docs.length > 0) return docs;
      } catch (err) {
        console.error('Error fetching tenders from MongoDB:', err.message);
      }
    }

    return Array.from(memoryStore.values()).sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }

  static async findById(id) {
    if (!id) return null;

    if (this.isMongoConnected()) {
      try {
        const doc = await Tender.findOne({ id }).lean();
        if (doc) return doc;
      } catch (err) {
        console.error(`Error finding tender ${id} in MongoDB:`, err.message);
      }
    }

    if (memoryStore.has(id)) {
      return memoryStore.get(id);
    }

    // Direct check in sample dataset
    const sample = SAMPLE_TENDERS_BACKEND.find((t) => t.id === id || t.nitNumber === id);
    if (sample) {
      memoryStore.set(sample.id, sample);
      return sample;
    }

    return null;
  }

  static async update(id, updateFields) {
    if (this.isMongoConnected()) {
      try {
        const doc = await Tender.findOneAndUpdate(
          { id },
          { $set: updateFields },
          { new: true }
        ).lean();
        if (doc) {
          memoryStore.set(id, doc);
          return doc;
        }
      } catch (err) {
        console.error(`Error updating tender ${id} in MongoDB:`, err.message);
      }
    }

    const existing = memoryStore.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updateFields };
    memoryStore.set(id, updated);
    return updated;
  }

  static async deleteById(id) {
    if (this.isMongoConnected()) {
      try {
        await Tender.findOneAndDelete({ id });
      } catch (err) {
        console.error(`Error deleting tender ${id} in MongoDB:`, err.message);
      }
    }

    return memoryStore.delete(id);
  }
}

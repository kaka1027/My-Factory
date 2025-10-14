import mongoose from 'mongoose';

export interface IVisitor {
  name: string;
  timestamp: Date;
  lastVisit: Date;
  visitCount: number;
}

const visitorSchema = new mongoose.Schema<IVisitor>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  lastVisit: {
    type: Date,
    default: Date.now
  },
  visitCount: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

export default mongoose.model<IVisitor>('Visitor', visitorSchema);
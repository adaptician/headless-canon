// For some reason these don't work when added to the .d.ts file itself. No idea why - it seems like it should.
export const SHAPE_TYPES = {
    SPHERE: 'sphere',
    BOX: 'box',
    UNKNOWN: 'unknown',
} as const;

export type ShapeType = typeof SHAPE_TYPES[keyof typeof SHAPE_TYPES];

import { extendType, objectType} from 'nexus';
import axios from 'axios';
import  z  from 'zod';

// Zod Schemas
export const PromotionAnswerSchema = z.object({
    id: z.string().nullable().optional(),
    priority: z.number().nullable().optional(),
    displayValue: z.string().nullable().optional(),
});

export const ProductPromotionSchema = z.object({
    promotionId: z.string().nullable(),
    priority: z.number().nullable().optional(),
    text: z.string().nullable().optional(),
    content: z.string().nullable().optional(),
    header: z.string().nullable().optional(),
    subHeader: z.string().nullable().optional(),
    label: z.string().nullable().optional(),
    startDate: z.string().nullable().optional(),
    endDate: z.string().nullable().optional(),
    backgroundColourType: z.string().nullable().optional(),
    operation: z.string().nullable().optional(),
    promotionAnswer: z.array(PromotionAnswerSchema).nullable().optional(),
    actionAcceptURL: z.string().nullable().optional(),
    display: z.string().nullable().optional(),
    source: z.string().nullable().optional(),
    promoGroup: z.string().nullable().optional(),
    promoExternalId: z.string().nullable().optional(),
    nboStory: z.string().nullable().optional(),
    actionLabel: z.string().nullable().optional(),
    backgroundColour: z.string().nullable().optional(),
    backgroundImageURL: z.string().nullable().optional(),
    logo: z.string().nullable().optional(),
    offerRestrictedPeriod: z.number().nullable().optional(),
    actionDetailLabel: z.string().nullable().optional(),
});
export const ResponseSchema = z.object({
    productPromotions: z.object({
        productPromotion: z.array(ProductPromotionSchema),
    }),
});

export const ProductPromotionsSchema = z.object({
    productPromotion: z.array(ProductPromotionSchema),
});

// Nexus Types
export const PromotionAnswer = objectType({
    name: 'PromotionAnswer',
    definition(t) {
        t.string('id');
        t.int('priority');
        t.string('displayValue');
    },
});

export const ProductPromotion = objectType({
    name: 'ProductPromotion',
    definition(t) {
        t.string('promotionId');
        t.string('actionLabel');
        t.string('backgroundColour');
        t.string('backgroundColourType');
        t.string('backgroundImageURL');
        t.string('header');
        t.string('subHeader');
        t.string('content');
        t.string('text'); // Corrected to non-nullable types where necessary
        t.int('offerRestrictedPeriod');
        t.string('nboStory');
        t.int('priority');
        t.string('source');
        t.string('promoExternalId');
        t.string('promoGroup');
        t.list.field('promotionAnswer', { type: 'PromotionAnswer' }); // Corrected to nullable list field
    },
});

export const ProductPromotions = objectType({
    name: 'ProductPromotions',
    definition(t) {
        t.nonNull.list.field('productPromotion', { type: 'ProductPromotion' });
    },
});

export const ProductPromotionsQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('productPromotionsQuery', {
            type: 'ProductPromotions',
            resolve: async () => {
                try {
                    const response = await axios.get('http://localhost:8080/api/v1/productPromotions');
                    const parsedData = ResponseSchema.parse(response.data);
                    return { productPromotion: parsedData.productPromotions.productPromotion };
                } catch (error) {
                    console.error(error);
                    throw new Error('Failed to fetch product promotions');
                }
            },
        });
    },
});
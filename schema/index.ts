import { makeSchema } from 'nexus'
import * as QueryTypes from './Query'
import * as BonusSlotsTypes from './BonusSlotsQuery'
import * as AppSlotsTypes from './AppSlotsQuery'
import * as ApprovalsTypes from './ApprovalsQuery'
import * as ProductPromotionsTypes from './ProductPromotionsQuery'
import * as ssoAccountTypes from './SsoAccountQuery'
import * as subscriberType from './SubscriberQuery'
import * as servicesAndUsageTypes from './ServicesAndUsageQuery'
import path from 'path'

const schema = makeSchema({
    types: [QueryTypes, BonusSlotsTypes, AppSlotsTypes, ApprovalsTypes, ProductPromotionsTypes, ssoAccountTypes, subscriberType, servicesAndUsageTypes],
    outputs: {
        typegen: path.join(process.cwd(), 'generated/nexus-typegen.ts'),
        schema: path.join(process.cwd(), 'generated/schema.graphql'),
    }
})
export default schema
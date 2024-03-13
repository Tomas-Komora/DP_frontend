import { request, gql } from 'graphql-request'

export async function getServerSideProps() {
  const query = gql`
    {
      frameworks {
        id
        name
      }
    }
  `
  const data = await request('http://localhost:3000/api/graphql', query)
  const { frameworks } = data
  return {
    props: {
      frameworks,
    },
  }
}
export default function Home({ frameworks }) {
  return (
      <div className="">
        <ul>
          {frameworks.map(f => (
              <li key={f.id} className="text-xs text-sky-900">{f.name}{f.id}</li>
          ))}
        </ul>
      </div>
  )
}

// <div>
//     <div>
//         <h1>Product Promotions</h1>
//         <ul>
//             {productPromotions.map((productPromotion) => (
//                 <li key={productPromotion.promotionId}>
//                     {productPromotion.header} - {productPromotion.subHeader}
//                     <p>{productPromotion.promotionId}</p>
//                     <p>{productPromotion.actionLabel}</p>
//                     <p>{productPromotion.backgroundColour}</p>
//                     <p>{productPromotion.backgroundColourType}</p>
//                     <p>{productPromotion.backgroundImageURL}</p>
//                     <p>{productPromotion.content}</p>
//                     <p>{productPromotion.text}</p>
//                     <p>{productPromotion.offerRestrictedPeriod}</p>
//                     <p>{productPromotion.nboStory}</p>
//                     <p>{productPromotion.priority}</p>
//                     <p>{productPromotion.source}</p>
//                     <p>{productPromotion.promoExternalId}</p>
//                     <p>{productPromotion.promoGroup}</p>
//                     <p>{productPromotion.promotionAnswer.id}</p>
//                     <p>{productPromotion.promotionAnswer.priority}</p>
//                     <p>{productPromotion.promotionAnswer.displayValue}</p>
//                 </li>
//             ))}
//         </ul>
//
//     </div>
//
//     <div>
//         <h1>Services</h1>
//         <ul>
//             {services.map((service) => (
//                 <li key={service.productId}>
//                     {service.productName} - {service.serviceGroup}
//                     <p>{service.productId}</p>
//                     <p>{service.status}</p>
//                     <p>{service.activateOn}</p>
//                     <p>{service.listPriority}</p>
//                     <p>{service.instanceId}</p>
//                     <p>{service.allowedModification}</p>
//                     <p>{service.type}</p>
//                     <p>{service.priceWithVAT}</p>
//                     <p>{service.listPriceWithVAT}</p>
//                     <p>{service.period}</p>
//                     <p>{service.protectionPeriodEndDate}</p>
//                     <p>{service.validTo}</p>
//                     <p>{service.isMultiInstance}</p>
//                     <p>{service.activationCode}</p>
//                     <p>{service.priceLevels?.priceList}</p>
//                     <p>{service.priceLevels?.priceWithVAT}</p>
//                     <p>{service.priceLevels?.isActive}</p>
//                     <p>{service.priceLevels?.isEnabled}</p>
//                     <p>{servicesAndUsageQuery.usageAt}</p>
//                     <p>{servicesAndUsageQuery.usageSummary.priceAfterAppliedFU}</p>
//                     <p>{servicesAndUsageQuery.usageSummary.priceAfterAppliedFUWithVAT}</p>
//                     <p>{servicesAndUsageQuery.usageSummary.accummulatedCharges.chargeUnit}</p>
//                     <p>{servicesAndUsageQuery.usageSummary.accummulatedCharges.chargeQuantity}</p>
//                     <p>{servicesAndUsageQuery.usageSummary.accummulatedCharges.chargeValue}</p>
//                     <p>{servicesAndUsageQuery.usageSummary.accummulatedCharges.chargeValueWithVAT}</p>
//                     <p>{servicesAndUsageQuery.lastRoamingZone}</p>
//                 </li>
//             ))}
//         </ul>
//     </div>
//
//
// </div>
import {
  reactExtension,
  Banner,
  useCartLines,
  useAppMetafields,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <LongDeliveryBanner />
);

function LongDeliveryBanner() {
  const cartLines = useCartLines();
  
  const metafields = useAppMetafields({
    namespace: 'custom',
    key: 'long_delivery',
  });
  
  const hasLongDelivery = cartLines.some((line) => {
    const product = line.merchandise?.product;
    if (!product) {
      return false;
    }
    
    const productIdGid = product.id;
    const productIdNumeric = productIdGid.includes('/') 
      ? productIdGid.split('/').pop() 
      : productIdGid;
    
    // Find metafield for this product - match by numeric ID
    const productMetafield = metafields.find((metafield: any) => {
      const metafieldTargetId = metafield?.target?.id;
      // Handle both GID format and numeric string format
      const metafieldIdNumeric = typeof metafieldTargetId === 'string' && metafieldTargetId.includes('/')
        ? metafieldTargetId.split('/').pop()
        : String(metafieldTargetId);

      return metafieldIdNumeric === productIdNumeric;
    });
    
    if (productMetafield) {
      const value = productMetafield.metafield?.value;
      
      if (value === true || (typeof value === 'string' && value.toLowerCase() === 'true')) {
        return true;
      }
    }
    
    return false;
  });

  if (!hasLongDelivery) {
    return null;
  }

  return (
    <Banner 
      status="critical" 
      title="Some items in your order have long delivery times."
    >
      Please check estimated delivery time before placing the order.
    </Banner>
  );
}


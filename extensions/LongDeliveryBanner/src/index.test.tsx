import {
  reactExtension,
  Banner,
} from '@shopify/ui-extensions-react/checkout';

// TEST VERSION - Always shows banner to verify extension is working
// Replace the default export in index.tsx with this to test
export default reactExtension(
  'purchase.checkout.block.render',
  () => (
    <Banner status="critical" title="Some items in your order have long delivery times.">
      Please check estimated delivery time before placing the order.
    </Banner>
  )
);


import type { Schema, Struct } from '@strapi/strapi';

export interface SharedAddress extends Struct.ComponentSchema {
  collectionName: 'components_shared_addresses';
  info: {
    displayName: 'Address';
    icon: 'address-book';
  };
  attributes: {
    city: Schema.Attribute.String & Schema.Attribute.Required;
    country: Schema.Attribute.String & Schema.Attribute.Required;
    postalCode: Schema.Attribute.String;
    State: Schema.Attribute.String;
    street: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedImageGallery extends Struct.ComponentSchema {
  collectionName: 'components_shared_image_galleries';
  info: {
    displayName: 'Image Gallery';
    icon: 'address-book';
  };
  attributes: {
    altText: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface SharedOrderItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_order_items';
  info: {
    displayName: 'Order Item';
    icon: 'shopping-cart';
  };
  attributes: {
    price: Schema.Attribute.Decimal & Schema.Attribute.Required;
    product: Schema.Attribute.Relation<'oneToOne', 'api::product.product'>;
    quantity: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<1>;
    variantColour: Schema.Attribute.String;
    variantName: Schema.Attribute.String;
    variantSize: Schema.Attribute.String;
    variantSku: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedProductVariant extends Struct.ComponentSchema {
  collectionName: 'components_shared_product_variants';
  info: {
    displayName: 'Product Variant';
    icon: 'address-book';
  };
  attributes: {
    colour: Schema.Attribute.String;
    images: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    name: Schema.Attribute.String;
    price: Schema.Attribute.Decimal;
    size: Schema.Attribute.String;
    sku: Schema.Attribute.String & Schema.Attribute.Unique;
    stock: Schema.Attribute.Integer;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo Fields';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    MetaImage: Schema.Attribute.Media<'images'>;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedShippingOptions extends Struct.ComponentSchema {
  collectionName: 'components_shared_shipping_options';
  info: {
    displayName: 'shippingOptions';
  };
  attributes: {
    deliveryTime: Schema.Attribute.String;
    name: Schema.Attribute.String;
    price: Schema.Attribute.Decimal;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.address': SharedAddress;
      'shared.image-gallery': SharedImageGallery;
      'shared.order-item': SharedOrderItem;
      'shared.product-variant': SharedProductVariant;
      'shared.seo': SharedSeo;
      'shared.shipping-options': SharedShippingOptions;
    }
  }
}

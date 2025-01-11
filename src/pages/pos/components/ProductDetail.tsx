import { Plus } from "lucide-react";
// import Tile from "@/assets/tile.jpg";
import { Button } from "@/components/ui/button";
import { FC } from "react";
import usePosStore from "@/store/pos";
import { ProductProps } from "@/interfaces/products";
import { get } from "lodash";

const ProductDetail: FC<{ product: ProductProps }> = ({ product }) => {
  const productSellingPrice = get(product, "productSellingPrice", 0);
  const quantity = get(product, "productQuantity.availableQuantity", 0);
  const _id = get(product, "_id", "");
  const productCode = get(product, "productCode.code", "");
  const productName = productCode ? `${productCode} - ${product.name}` : product.name;

  const { addItem } = usePosStore();

  const handleAddProduct = () => {
    addItem({ id: _id, name: productName, price: productSellingPrice, quantity: 1 });
  };

  return (
    <div
      className={`p-2 flex flex-col shadow border rounded-md relative ${
        quantity < 1 && "opacity-70 cursor-not-allowed pointer-events-none bg-gray-100"
      }`}
    >
      <div className="product-image flex-1 mb-4">
        {/* <img src={Tile} alt="" className="h-full w-full rounded-md" /> */}
      </div>
      <div className="product-content flex-1">
        <p className="title text-sm">{productName}</p>
        <h1 className="price font-semibold mt-2">&#8373;{productSellingPrice.toFixed(2)}</h1>
      </div>
      <div className="flex flex-1 my-2 items-center justify-end">
        {quantity > 0 && (
          <Button
            size={"icon"}
            className="flex bg-gray-100 text-primary items-center justify-center rounded-md hover:bg-gray-200"
            onClick={handleAddProduct}
          >
            <Plus size={18} />
          </Button>
        )}
      </div>
      {quantity < 1 && <span className="text-[11px] text-red-500">Out of stock</span>}
      {quantity > 0 && <div className="absolute bottom-0 left-2 text-[11px]">{quantity}</div>}
    </div>
  );
};

export default ProductDetail;

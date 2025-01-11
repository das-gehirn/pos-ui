import DashboardLayout from "@/components/dashboard/Layout";
import OrderDetails from "./components/OrderDetails";
import CustomField from "@/components/customFields/input/CustomInput";
import { ChevronLeft, History, Search, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Tabs from "@/components/Tabs";
import Tab from "@/components/Tab";
import ProductDetails from "./components/ProductDetails";
import { useEffect, useState, useCallback } from "react";
import Drawer from "@/components/Drawer";
import SelectField from "@/components/customFields/Select/SelectField";
import { Slider } from "@/components/ui/slider";
import PrimaryButton from "@/components/PrimaryButton";
import InfiniteScroll from "react-infinite-scroll-component";
import { startCase } from "lodash";
import { useGeneralQuery } from "@/hooks/request/useGeneralQuery";
import { GetManyProps } from "@/hooks/types";
import { ProductCategoryProps } from "@/interfaces/productCategories";
import { ProductProps } from "@/interfaces/products";
import useProductStore from "@/store/products";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useRoleRedirect } from "@/hooks/useRoleRedirect";
import TodaySales from "../sales/component/TodaySales";
import { HandlerProps } from "@/components/customFields/type";
import { useFormFieldUpdate } from "@/hooks/useFormFieldUpdate";
type ProductQueryProps = {
  deleted: boolean;
  limit: number;
  currentPage: number;
  categoryId?: string;
  search?: string;
};

const ShimmerLoader = () => {
  return (
    <div className="p-2 flex flex-col shadow border rounded-md relative animate-pulse">
      <div className="product-image flex-1 mb-4 h-1/2 bg-gray-200 rounded-md"></div>
      <div className="product-content flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="flex flex-1 my-2 items-center justify-end">
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      </div>
      <div className="absolute bottom-5 left-2 text-[11px] bg-gray-200 h-2 w-8"></div>
    </div>
  );
};

const SellProductScreen = () => {
  const productSearch = {
    name: ""
  };

  const { formValues, updateFormFieldValue } = useFormFieldUpdate(productSearch);
  const { redirectHome } = useRoleRedirect();
  const { products, updateProducts, setProducts } = useProductStore();
  const [currentTab, setCurrentTab] = useState("all");
  const initialProductQueryState = useCallback(
    () => ({
      deleted: false,
      limit: 30,
      currentPage: 1,
      categoryId: "all"
    }),
    []
  );

  const [productQuery, setProductQuery] = useState<Partial<ProductQueryProps>>(initialProductQueryState());

  const handleSetActiveTab = (tab: Record<string, any>) => {
    setCurrentTab(tab.value);
    let query = {
      ...initialProductQueryState(),
      categoryId: tab.value
    };

    setProductQuery(query);
    setProducts([]);
  };
  const queryObject = { deleted: false };
  const { data: productCategories, isFetching: categoriesFetching } = useGeneralQuery<
    GetManyProps<ProductCategoryProps[]>
  >({
    queryKey: ["productCategories", queryObject],
    url: "/product-categories",
    query: queryObject,
    enabled: !!Object.keys(queryObject).length
  });

  const { data: productsData, isFetching } = useGeneralQuery<GetManyProps<ProductProps[]>>({
    queryKey: ["products", productQuery],
    url: "/products/general",
    query: productQuery,
    enabled: !!Object.keys(productQuery).length,
    requireAuth: true,
    staleTime: 0
  });

  const categories = productCategories?.data || [];
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    if (productsData) {
      updateProducts(productsData.data || []);
    }
  }, [productsData, updateProducts]);

  const handleFilterShow = () => {
    setShowFilter(true);
  };

  const handleSelectChange = () => {
    // Implement your select change logic
  };

  const handleFetchNextProduct = () => {
    setProductQuery((prev) => ({
      ...prev,
      limit: (prev?.limit || 0) + 30,
      currentPage: 1
    }));
  };
  const handleGoBack = () => {
    redirectHome();
  };
  useEffect(() => {
    setProducts(productsData?.data || []);
  }, [productQuery, currentTab, productsData, setProducts]);

  const handleItemSearch = (data: HandlerProps) => {
    updateFormFieldValue(data.key, data.value);

    if (data.value.length >= 3 || !data.value.length) {
      setProductQuery(() => ({
        search: data.value,
        searchSelection: "productCodeId"
      }));
    }
  };
  return (
    <DashboardLayout showSidebar={false} fullWidth showHeaderSearchBar={false} isLoading={categoriesFetching}>
      <Drawer
        description="Select fields to filter out products based on filter selected"
        position="left"
        title="Filter"
        handleDrawerClose={() => setShowFilter(!showFilter)}
        open={showFilter}
      >
        <div className="mb-3">
          <SelectField onChange={handleSelectChange} fieldKey="" options={[]} isMulti label="Brand" />
          <SelectField onChange={handleSelectChange} fieldKey="" options={[]} isMulti label="Code" />
          <SelectField onChange={handleSelectChange} fieldKey="" options={[]} isMulti label="Unit" />
          <div className="mt-5">
            <h1>Price Range</h1>
            <div className="flex items-center justify-between my-2">
              <div>
                <p className="text-[12px] font-light">Min</p>
                <span className="text-[12px] font-semibold">0</span>
              </div>
              <div>
                <p className="text-[12px] font-light">Max</p>
                <span className="text-[12px] font-semibold">10,000</span>
              </div>
            </div>
            <Slider defaultValue={[50]} max={10000} step={1} />
            <div className="text-center my-0.5">0</div>
          </div>
        </div>
        <div className="h-full flex flex-col mt-5">
          <div className="my-5 text-center">
            <div className="button-container flex justify-between items-center gap-4">
              <PrimaryButton text="Cancel" variant={"outline"} className="w-full border-primary" onClick={() => {}} />
              <PrimaryButton text="Apply" onClick={() => {}} />
            </div>
          </div>
        </div>
      </Drawer>
      <div className="min-h-screen h-screen">
        <div className="h-full border">
          <section id="products-section" className="products-section md:w-[70%] bg-white h-full overflow-x-scroll">
            <div className="shadow py-3 px-10">
              <div className="flex items-end justify-between gap-5">
                <div className="ml-3">
                  <Button
                    size={"icon"}
                    className="w-[50px] bg-white border border-primary hover:bg-gray-100 text-primary"
                    onClick={handleGoBack}
                  >
                    <ChevronLeft size={18} />
                  </Button>
                </div>
                <div className="flex-1 flex items-center justify-end">
                  {/* SALES REPORT */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size={"icon"} className="w-[50px] bg-gray-50 hover:bg-gray-100 text-primary">
                        <History size={18} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-screen h-screen overflow-auto !rounded-none">
                      <div className="flex h-full w-full flex-col">
                        {/* CONTENT START */}
                        <div className="content flex-1">
                          <div className="flex items-end justify-end">
                            <AlertDialogCancel className="flex bg-transparent hover:bg-transparent w-8 h-8">
                              X
                            </AlertDialogCancel>
                          </div>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-center">Sales Report</AlertDialogTitle>
                          </AlertDialogHeader>

                          <TodaySales />
                        </div>
                        {/* CONTENT END */}
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                        </AlertDialogFooter>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
            <div className="p-10">
              <div className="search md:flex justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-center mb-5 md:mb-0">POS</h1>
                </div>
                <div className="flex gap-5">
                  <CustomField
                    handleInputChange={handleItemSearch}
                    fieldKey="name"
                    type="text"
                    icon={{ element: Search, position: "left", show: true, className: "bg-transparent" }}
                    placeholder="Search"
                    className="bg-gray-50 flex-1 w-full"
                    value={formValues?.name}
                  />
                  <Button
                    className="filter shadow w-[50px] h-10 rounded flex items-center justify-center text-gray-600 bg-white hover:text-white"
                    onClick={handleFilterShow}
                  >
                    <Settings2 size={20} />
                  </Button>
                </div>
              </div>
              <InfiniteScroll
                dataLength={products.length}
                next={handleFetchNextProduct}
                hasMore={Boolean((productsData?.paginator.totalDocuments || 0) > products.length && products.length)}
                loader={<h4>Fetching more products...</h4>}
                scrollableTarget="products-section"
              >
                <div className="products">
                  <div>
                    <Tabs getActiveTab={handleSetActiveTab} defaultTab={"all"}>
                      <Tab label={"All"} value={"all"} key="all">
                        {isFetching && (
                          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {new Array(8).fill(0).map((_, i) => {
                              return <ShimmerLoader key={i} />;
                            })}
                          </div>
                        )}
                        {!isFetching && (
                          <div className="py-4">
                            <ProductDetails products={products} />
                          </div>
                        )}
                      </Tab>
                      {categories.map((category, index) => (
                        <Tab label={startCase(category?.name || "")} value={category?._id || ""} key={index}>
                          {isFetching && (
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                              {new Array(8).fill(0).map((_, i) => {
                                return <ShimmerLoader key={i} />;
                              })}
                            </div>
                          )}
                          {!isFetching && (
                            <div className="py-4">
                              <ProductDetails products={products} />
                            </div>
                          )}
                        </Tab>
                      ))}
                    </Tabs>
                  </div>
                </div>
              </InfiniteScroll>
            </div>
          </section>
          <OrderDetails />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SellProductScreen;

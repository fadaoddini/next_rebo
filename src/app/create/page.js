"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import Config from "@/config/config";
import ProductTypeSelector from "@/components/bazar/Form/ProductTypeSelector";
import AttributesSelector from "@/components/bazar/Form/AttributeSelector";
import ImageUploader from "@/components/bazar/Form/ImageUploader";
import Select from "react-select";
import styles from "@/styles/styleCreate.module.css";
import FormInputs from "@/components/bazar/Form/FormInputs";
import useCheckToken from "@/hook/useCheckToken";

export default function Create() {

  const isLoggedIn = useCheckToken(); 
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchedToken = localStorage.getItem("accessToken");
      setToken(fetchedToken);
    }
  }, [isLoggedIn]);
  
  const [formData, setFormData] = useState({
    price: "",
    weight: "",
    warranty: "False",
    expire_time: "1",
    description: "",
    sell_buy: "", // اصلاح شده
    productType: null,
    attributeValues: {},
    images: []
  });

  const [productTypes, setProductTypes] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [attributeOptions, setAttributeOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);

  // گرفتن انواع محصول از سرور
  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const response = await axios.get(
          Config.getApiUrl("catalogue", "product_types")
        );
        const typeOptions = response.data.map((type) => ({
          value: type.id,
          label: type.title,
        }));
        setProductTypes(typeOptions);
      } catch (err) {
        console.error("Error fetching product types:", err);
        setError("خطا در بارگذاری انواع محصولات. لطفاً دوباره تلاش کنید.");
      }
    };
    fetchProductTypes();
  }, []);

  // گرفتن ویژگی‌های محصول بر اساس نوع محصول
  useEffect(() => {
    const fetchAttributes = async () => {
      if (formData.productType) {
        try {
          const response = await axios.get(
            Config.getApiUrl("catalogue", "product_attributes"),
            {
              params: { product_type_id: formData.productType.value },
            }
          );
          const attributeOptions = response.data.map((attr) => ({
            value: attr.id,
            label: attr.title,
          }));
          setAttributes(attributeOptions);
          setFormData((prevState) => ({
            ...prevState,
            attributeValues: {},
          }));
          setAttributeOptions({});
        } catch (err) {
          console.error("Error fetching attributes:", err);
          setError("خطا در بارگذاری ویژگی‌ها. لطفاً دوباره تلاش کنید.");
        }
      } else {
        setAttributes([]);
        setFormData((prevState) => ({
          ...prevState,
          attributeValues: {},
        }));
        setAttributeOptions({});
      }
    };
    fetchAttributes();
  }, [formData.productType]);

  const fetchAttributeValues = async (attributeId) => {
    try {
      const response = await axios.get(
        Config.getApiUrl("catalogue", "attribute_values"),
        {
          params: { attribute_id: attributeId },
        }
      );
      const values = response.data.map((value) => ({
        value: value.id,
        label: value.value,
      }));
      setAttributeOptions((prevOptions) => ({
        ...prevOptions,
        [attributeId]: values,
      }));
    } catch (err) {
      console.error("Error fetching attribute values:", err);
      setError("خطا در بارگذاری مقادیر ویژگی‌ها. لطفاً دوباره تلاش کنید.");
    }
  };

  const handleProductTypeChange = (selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      productType: selectedOption,
    }));
  };

  const handleAttributeValueChange = (attributeId, selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      attributeValues: {
        ...prevState.attributeValues,
        [attributeId]: selectedOption || null,
      },
    }));
  };

  const handleAttributeSelect = (attribute) => {
    if (!formData.attributeValues[attribute.value]) {
      fetchAttributeValues(attribute.value);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData();
    form.append("price", formData.price);
    form.append("weight", formData.weight);
    form.append("warranty", formData.warranty);
    form.append("expire_time", formData.expire_time);
    form.append("description", formData.description);
    form.append(
      "product_type",
      formData.productType ? formData.productType.value : ""
    );
    form.append("sell_buy", formData.sell_buy); // اصلاح شده

    const attrs = Object.keys(formData.attributeValues).map((attributeId) => ({
      attr: attributeId,
      value: formData.attributeValues[attributeId].value,
    }));
    form.append("attrs", JSON.stringify(attrs));

    formData.images.forEach((image, index) => {
      form.append(`image${index}`, image);
    });
    form.append("numpic", formData.images.length);

    try {
      const response = await axios.post(
        Config.getApiUrl("catalogue", "add_product_api"),
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      );

      console.log("محصول با موفقیت اضافه شد:", response.data);
    } catch (err) {
      console.error(
        "خطا در افزودن محصول:",
        err.response ? err.response.data : err.message
      );
      setError("خطا در افزودن محصول. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-center py-10">ایجاد</h1>
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          <div className={styles.choose_bazar}>
            <div className={styles.form_group}>
              <label htmlFor="bazar_type" className={styles.label}>
                نوع بازار
              </label>
              <Select
                id="bazarType"
                value={formData.sell_buy}
                options={[
                  { value: "1", label: "فروش" },
                  { value: "2", label: "خرید" },
                ]}
                isClearable
                onChange={(selectedOption) => {
                  setFormData((prevState) => ({
                    ...prevState,
                    sell_buy: selectedOption ? selectedOption.value : null,
                  }));
                }}
                className={styles.form_control}
                placeholder="انتخاب کنید..."
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "1px solid #ccc",
                    boxShadow: "none",
                    "&:hover": { borderColor: "#007bff" },
                  }),
                  placeholder: (base) => ({ ...base, color: "#888" }),
                }}
              />
            </div>
          </div>
          <div className={styles.box_attr}>
            <ProductTypeSelector
              formData={formData}
              productTypes={productTypes}
              handleProductTypeChange={handleProductTypeChange}
            />
            {formData.productType && (
              <AttributesSelector
                attributes={attributes}
                attributeOptions={attributeOptions}
                formData={formData}
                handleAttributeValueChange={handleAttributeValueChange}
                handleAttributeSelect={handleAttributeSelect}
              />
            )}
          </div>
          <div className={styles.all_row}>
            <div className={styles.right_row}>
              <FormInputs formData={formData} handleChange={handleChange} />
            </div>
            <div className={styles.left_row}>
              <ImageUploader
                formData={formData}
                setFormData={setFormData}
                imagePreviews={imagePreviews}
                setImagePreviews={setImagePreviews}
              />
            </div>
          </div>
          <div className="text-center">
            {loading ? (
              <button className="btn btn-primary" disabled>
                در حال ارسال...
              </button>
            ) : (
              <button className="btn btn-primary">ارسال محصول</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

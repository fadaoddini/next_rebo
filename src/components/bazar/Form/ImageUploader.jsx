import React from "react";
import { useDropzone } from "react-dropzone";
import styles from "./ImageUploader.module.css"; // استایل‌های مربوط به کامپوننت

const ImageUploader = ({ formData, setFormData, imagePreviews, setImagePreviews }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      const newImages = acceptedFiles.filter(
        (file) => !formData.images.some((img) => img.name === file.name)
      );

      if (newImages.length > 0) {
        const newImagePreviews = newImages.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
        setFormData((prevState) => ({
          ...prevState,
          images: [...prevState.images, ...newImages],
        }));
        setImagePreviews((prevPreviews) => [
          ...prevPreviews,
          ...newImagePreviews,
        ]);
      }
    },
  });

  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index].preview);

    const newImages = formData.images.filter((_, i) => i !== index);
    const newImagePreviews = imagePreviews.filter((_, i) => i !== index);

    setFormData((prevState) => ({
      ...prevState,
      images: newImages,
    }));
    setImagePreviews(newImagePreviews);
  };

  return (
    <div className={styles.form_group}>
      <label htmlFor="imageUploader" className={styles.label}>
        تصاویر محصول
      </label>
      <div {...getRootProps({ className: styles.dropzone })}>
        <input {...getInputProps()} id="imageUploader" />
        <p>بکشید و رها کنید یا کلیک کنید برای انتخاب تصاویر</p>
      </div>
      <div className={styles.image_preview_section}>
        <div className={styles.image_preview_list}>
          {imagePreviews.map((file, index) => (
            <div key={index} className={styles.image_list_item}>
              <img
                src={file.preview}
                alt={`Preview ${index}`}
                className={styles.image_preview}
                onLoad={() => URL.revokeObjectURL(file.preview)}
              />
              <button
                type="button"
                className={styles.remove_button}
                onClick={() => handleRemoveImage(index)}
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;

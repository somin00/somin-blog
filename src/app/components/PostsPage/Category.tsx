import React, { SyntheticEvent } from "react";
import styles from "./Category.module.css";
import { Category } from "../../../../types";

export default function CategoryList({
  categories,
  onChange,
}: {
  categories: Category[];
  onChange: (e: SyntheticEvent) => void;
}) {
  return (
    <div className={styles.container}>
      <select onChange={onChange}>
        {categories.map((category) => (
          <option key={category.id} value={category.category}>
            {category.category}
          </option>
        ))}
      </select>
    </div>
  );
}

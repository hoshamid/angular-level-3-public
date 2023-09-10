import { Injectable } from '@angular/core';
import { ICategory } from '../models/category';

@Injectable({ providedIn: 'root' })
export class CategoriesExtracterService {
  public extract(delimiter: string, categories: ICategory[]) {
    const keyValuePair: { [name: string]: ICategory } = {};
    const result: Partial<ICategory> = {};

    categories.forEach((category) => {
      category.name.split(delimiter).reduce((previousCategory, name) => {
        const trimedName = name.trim();
        if (!keyValuePair[trimedName]) {
          const categoryToAssign = { ...category, name: trimedName };
          keyValuePair[trimedName] = categoryToAssign;
          previousCategory.subCategories = previousCategory.subCategories || [];
          previousCategory.subCategories.push(categoryToAssign);
          delete previousCategory.id;
        }

        return keyValuePair[trimedName];
      }, result);
    });

    return result?.subCategories ?? [];
  }
}

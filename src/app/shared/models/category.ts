import { IDropdownOption } from '../components/standard-dropdown/models/dropdown-option';

export interface ICategory extends IDropdownOption {
  subCategories?: ICategory[];
}

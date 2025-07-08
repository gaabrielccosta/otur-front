import { IFoto } from "./IFoto";

export interface IVinicula {
  id: number;
  nome: string;
  horarios: string;
  instagram: string;
  localizacao: string;
  fotos: IFoto[];
}

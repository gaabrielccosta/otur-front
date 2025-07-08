export interface IAvaliacao {
  id: number;
  estrelas: number;
  texto: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
  };
}

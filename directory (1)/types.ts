
export type Tag = 'work' | 'personal' | 'outreach';

export interface Person {
  id: string;
  name: string;
  fact: string;
  tags?: Tag[];
}

import PageRank from '@/components/page-rank';
import { ChunkMethodItem, EmbeddingModelItem } from './common-item';

export function TableConfiguration() {
  return (
    <>
      <ChunkMethodItem></ChunkMethodItem>
      <EmbeddingModelItem></EmbeddingModelItem>

      <PageRank></PageRank>
    </>
  );
}

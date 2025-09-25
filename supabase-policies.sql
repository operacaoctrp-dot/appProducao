-- ==========================================
-- POLÍTICAS DE SEGURANÇA PARA O SUPABASE
-- ==========================================

-- 1. POLÍTICA PARA STORAGE (Bucket 'Fotos')
-- Permitir que usuários autenticados façam upload de imagens

-- Primeiro, garantir que o bucket existe e está configurado corretamente
-- (Execute no SQL Editor do Supabase Dashboard)

-- Política para permitir INSERT (upload) no bucket Fotos
CREATE POLICY "Permitir upload de fotos para usuarios autenticados" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'Fotos' AND 
  auth.role() = 'authenticated'
);

-- Política para permitir SELECT (download/visualização) no bucket Fotos
CREATE POLICY "Permitir visualizacao de fotos para usuarios autenticados" ON storage.objects
FOR SELECT USING (
  bucket_id = 'Fotos' AND 
  auth.role() = 'authenticated'
);

-- Política para permitir UPDATE no bucket Fotos
CREATE POLICY "Permitir atualizacao de fotos para usuarios autenticados" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'Fotos' AND 
  auth.role() = 'authenticated'
);

-- Política para permitir DELETE no bucket Fotos
CREATE POLICY "Permitir exclusao de fotos para usuarios autenticados" ON storage.objects
FOR DELETE USING (
  bucket_id = 'Fotos' AND 
  auth.role() = 'authenticated'
);

-- ==========================================

-- 2. POLÍTICA PARA TABELA 'producao'
-- Permitir que usuários autenticados insiram, leiam, atualizem e excluam dados

-- Política para permitir INSERT na tabela producao
CREATE POLICY "Permitir insert na producao para usuarios autenticados" ON producao
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir SELECT na tabela producao
CREATE POLICY "Permitir select na producao para usuarios autenticados" ON producao
FOR SELECT USING (auth.role() = 'authenticated');

-- Política para permitir UPDATE na tabela producao
CREATE POLICY "Permitir update na producao para usuarios autenticados" ON producao
FOR UPDATE USING (auth.role() = 'authenticated');

-- Política para permitir DELETE na tabela producao
CREATE POLICY "Permitir delete na producao para usuarios autenticados" ON producao
FOR DELETE USING (auth.role() = 'authenticated');

-- ==========================================

-- 3. HABILITAR RLS (Row Level Security)
-- Certificar que o RLS está habilitado nas tabelas

-- Habilitar RLS na tabela producao
ALTER TABLE producao ENABLE ROW LEVEL SECURITY;

-- O RLS para storage.objects já está habilitado por padrão

-- ==========================================

-- 4. VERIFICAÇÃO DE POLÍTICAS
-- Para verificar se as políticas foram criadas corretamente:

-- Ver políticas da tabela producao
-- SELECT * FROM pg_policies WHERE tablename = 'producao';

-- Ver políticas do storage
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- ==========================================
-- INSTRUÇÕES DE USO:
-- 1. Acesse o Supabase Dashboard
-- 2. Vá em SQL Editor
-- 3. Cole e execute este código SQL
-- 4. Teste novamente o upload e salvamento no app
-- ==========================================
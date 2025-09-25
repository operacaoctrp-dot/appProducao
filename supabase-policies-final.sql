-- ==========================================
-- POLÍTICAS RLS PARA TABELA PRODUCAO EXISTENTE
-- ==========================================

-- Habilitar RLS na tabela (se ainda não estiver habilitado)
ALTER TABLE public.producao ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Permitir insert na producao para usuarios autenticados" ON public.producao;
DROP POLICY IF EXISTS "Permitir select na producao para usuarios autenticados" ON public.producao;
DROP POLICY IF EXISTS "Permitir update na producao para usuarios autenticados" ON public.producao;
DROP POLICY IF EXISTS "Permitir delete na producao para usuarios autenticados" ON public.producao;

-- Política para permitir INSERT na tabela producao
CREATE POLICY "Permitir insert na producao para usuarios autenticados" ON public.producao
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir SELECT na tabela producao
CREATE POLICY "Permitir select na producao para usuarios autenticados" ON public.producao
FOR SELECT USING (auth.role() = 'authenticated');

-- Política para permitir UPDATE na tabela producao
CREATE POLICY "Permitir update na producao para usuarios autenticados" ON public.producao
FOR UPDATE USING (auth.role() = 'authenticated');

-- Política para permitir DELETE na tabela producao
CREATE POLICY "Permitir delete na producao para usuarios autenticados" ON public.producao
FOR DELETE USING (auth.role() = 'authenticated');

-- ==========================================
-- POLÍTICAS PARA STORAGE (BUCKET FOTOS)
-- ==========================================

-- Política para permitir INSERT (upload) no bucket Fotos
DROP POLICY IF EXISTS "Permitir upload de fotos para usuarios autenticados" ON storage.objects;
CREATE POLICY "Permitir upload de fotos para usuarios autenticados" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'Fotos' AND 
  auth.role() = 'authenticated'
);

-- Política para permitir SELECT (download/visualização) no bucket Fotos
DROP POLICY IF EXISTS "Permitir visualizacao de fotos para usuarios autenticados" ON storage.objects;
CREATE POLICY "Permitir visualizacao de fotos para usuarios autenticados" ON storage.objects
FOR SELECT USING (
  bucket_id = 'Fotos' AND 
  auth.role() = 'authenticated'
);

-- Política para permitir UPDATE no bucket Fotos
DROP POLICY IF EXISTS "Permitir atualizacao de fotos para usuarios autenticados" ON storage.objects;
CREATE POLICY "Permitir atualizacao de fotos para usuarios autenticados" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'Fotos' AND 
  auth.role() = 'authenticated'
);

-- Política para permitir DELETE no bucket Fotos
DROP POLICY IF EXISTS "Permitir exclusao de fotos para usuarios autenticados" ON storage.objects;
CREATE POLICY "Permitir exclusao de fotos para usuarios autenticados" ON storage.objects
FOR DELETE USING (
  bucket_id = 'Fotos' AND 
  auth.role() = 'authenticated'
);

-- ==========================================
-- VERIFICAÇÃO
-- ==========================================

-- Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('producao', 'objects');

-- ==========================================
-- INSTRUÇÕES:
-- 1. Execute este SQL no Supabase Dashboard > SQL Editor
-- 2. Verifique se não há erros
-- 3. Teste o aplicativo novamente
-- ==========================================
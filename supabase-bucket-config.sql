-- ==========================================
-- CONFIGURAÇÃO DO BUCKET FOTOS PARA ACESSO PÚBLICO
-- ==========================================

-- 1. TORNAR O BUCKET PÚBLICO
-- Execute no SQL Editor do Supabase Dashboard

UPDATE storage.buckets 
SET public = true 
WHERE id = 'Fotos';

-- 2. VERIFICAR SE O BUCKET FOI CRIADO/CONFIGURADO
-- Se o bucket não existir, você precisará criá-lo primeiro via interface do Supabase Storage

-- Para verificar se o bucket existe:
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id = 'Fotos';

-- ==========================================
-- POLÍTICAS ADICIONAIS PARA ACESSO PÚBLICO
-- ==========================================

-- Política para permitir acesso público de leitura (visualização)
DROP POLICY IF EXISTS "Permitir acesso publico de leitura no bucket Fotos" ON storage.objects;
CREATE POLICY "Permitir acesso publico de leitura no bucket Fotos" ON storage.objects
FOR SELECT USING (bucket_id = 'Fotos');

-- ==========================================
-- INSTRUÇÕES IMPORTANTES:
-- ==========================================
-- 
-- OPÇÃO 1: BUCKET PÚBLICO (Mais simples)
-- 1. Execute o UPDATE acima
-- 2. Teste se as URLs públicas funcionam
--
-- OPÇÃO 2: SE NÃO QUISER BUCKET PÚBLICO
-- Use URLs assinadas no código JavaScript (mais seguro)
-- Vou mostrar como fazer isso no código
--
-- OPÇÃO 3: CRIAR BUCKET VIA SQL (se não existir)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('Fotos', 'Fotos', true);
-- 
-- ==========================================
-- ==========================================
-- ESTRUTURA DA TABELA PRODUCAO
-- ==========================================

-- Criar ou recriar a tabela producao com a estrutura correta
-- Execute no SQL Editor do Supabase Dashboard

-- Primeiro, vamos dropar a tabela se ela existir (cuidado: isso apagará todos os dados!)
-- DROP TABLE IF EXISTS producao;

-- Criar a tabela producao com as colunas corretas
CREATE TABLE IF NOT EXISTS producao (
  id BIGSERIAL PRIMARY KEY,
  "RSS" DECIMAL(10,2) NOT NULL,
  "GB" DECIMAL(10,2) DEFAULT 0,
  "RI" DECIMAL(10,2) DEFAULT 0,
  "Total" DECIMAL(10,2) NOT NULL,
  "DataFoto" DATE NOT NULL,
  "FotoFosso" TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Alternativa: Se você preferir nomes em minúsculas (mais comum no PostgreSQL)
-- Neste caso, você precisaria alterar o código JavaScript também

/*
CREATE TABLE IF NOT EXISTS producao (
  id BIGSERIAL PRIMARY KEY,
  rss DECIMAL(10,2) NOT NULL,
  gb DECIMAL(10,2) DEFAULT 0,
  ri DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  data_foto DATE NOT NULL,
  foto_fosso TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
*/

-- Habilitar RLS na tabela
ALTER TABLE producao ENABLE ROW LEVEL SECURITY;

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
-- VERIFICAÇÃO
-- ==========================================

-- Para verificar se a tabela foi criada corretamente:
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'producao' 
-- ORDER BY ordinal_position;

-- Para verificar as políticas:
-- SELECT * FROM pg_policies WHERE tablename = 'producao';

-- ==========================================
-- INSTRUÇÕES:
-- 1. Execute este SQL no Supabase Dashboard > SQL Editor
-- 2. Verifique se a tabela foi criada corretamente
-- 3. Teste novamente o salvamento no app
-- ==========================================
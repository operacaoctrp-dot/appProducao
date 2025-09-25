-- ==========================================
-- ESTRUTURA DA TABELA PRODUCAO (NOMES EM MINÚSCULAS)
-- ==========================================

-- Criar a tabela producao com nomes de colunas em minúsculas (padrão PostgreSQL)
-- Execute no SQL Editor do Supabase Dashboard

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

-- Adicionar comentários para documentação
COMMENT ON TABLE producao IS 'Tabela para armazenar dados de produção de resíduos';
COMMENT ON COLUMN producao.rss IS 'Resíduo de Serviço de Saúde em kg';
COMMENT ON COLUMN producao.gb IS 'Grupo B em kg';
COMMENT ON COLUMN producao.ri IS 'Resíduo Industrial em kg';
COMMENT ON COLUMN producao.total IS 'Total calculado em kg';
COMMENT ON COLUMN producao.data_foto IS 'Data da produção';
COMMENT ON COLUMN producao.foto_fosso IS 'URL da foto do fosso';

-- Habilitar RLS na tabela
ALTER TABLE producao ENABLE ROW LEVEL SECURITY;

-- Política para permitir INSERT na tabela producao
DROP POLICY IF EXISTS "Permitir insert na producao para usuarios autenticados" ON producao;
CREATE POLICY "Permitir insert na producao para usuarios autenticados" ON producao
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir SELECT na tabela producao
DROP POLICY IF EXISTS "Permitir select na producao para usuarios autenticados" ON producao;
CREATE POLICY "Permitir select na producao para usuarios autenticados" ON producao
FOR SELECT USING (auth.role() = 'authenticated');

-- Política para permitir UPDATE na tabela producao
DROP POLICY IF EXISTS "Permitir update na producao para usuarios autenticados" ON producao;
CREATE POLICY "Permitir update na producao para usuarios autenticados" ON producao
FOR UPDATE USING (auth.role() = 'authenticated');

-- Política para permitir DELETE na tabela producao
DROP POLICY IF EXISTS "Permitir delete na producao para usuarios autenticados" ON producao;
CREATE POLICY "Permitir delete na producao para usuarios autenticados" ON producao
FOR DELETE USING (auth.role() = 'authenticated');

-- ==========================================
-- VERIFICAÇÃO
-- ==========================================

-- Para verificar se a tabela foi criada corretamente:
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'producao' 
ORDER BY ordinal_position;

-- ==========================================
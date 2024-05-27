const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Configurar o modo Thick
oracledb.initOracleClient({ libDir: 'C:\\Program Files (x86)\\Oracle\\instantclient_21_13' });

// Inicialização do express
const app = express();

// Estabeleçendo a porta que rodará o Backend
const PORT = process.env.PORT || 3000;

// Chave secreta para o Login
const secretKey = 'skljaksdj9983498327453lsldkjf';

// Habilitar CORS
app.use(cors());

// Middleware para o Express tratar requisições JSON
app.use(express.json());

// Configurar a conexão com o banco de dados Oracle
const dbConfig = {
    user: 'system',
    password: '123456',
    connectString: 'localhost:1521/xe'
};

// Get empresas
app.get('/empresas', async (req, res) => {
    try {
        const connection = await oracledb.getConnection(dbConfig);

        await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = jvSolucoess`);

        const query = `SELECT id, nome, descricao FROM empresa`;
        const result = await connection.execute(query);

        const empresas = result.rows.map(row => ({
            id: row[0],
            nome: row[1],
            descricao: row[2],
        }));

        res.json(empresas);

        await connection.close();
    } catch (error) {
        console.error('Erro ao buscar empresas:', error);
        res.status(500).json({ error: 'Erro ao buscar empresas' });
    }
});

// GET consultores
app.get('/consultores', async (req, res) => {
    try {
        const connection = await oracledb.getConnection(dbConfig);

        await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = jvSolucoess`);

        const query = `SELECT e.nome as empresa_nome, p.nome as pessoa_nome, p.contato as pessoa_contato, p.email as pessoa_email, c.senha as consultor_senha
                       FROM empresa e INNER JOIN consultor c ON e.id = c.empresa_id INNER JOIN pessoa p ON c.pessoa_id = p.id`;
        const result = await connection.execute(query);

        const consultores = result.rows.map(row => ({
            empresa_nome: row[0],
            nome: row[1],
            contato: row[2],
            email: row[3],
            senha: row[4]
        }));

        res.json(consultores);

        await connection.close();
    } catch (error) {
        console.error('Erro ao buscar consultores:', error);
        res.status(500).json({ error: 'Erro ao buscar consultores' });
    }
});

// GET consultor por nome
app.get('/consultores/:nomeConsultor', async (req, res) => {
    const { nomeConsultor } = req.params;

    if (!nomeConsultor) {
        return res.status(400).json({ error: 'Nome do consultor é obrigatório' });
    }

    try {
        const connection = await oracledb.getConnection(dbConfig);

        await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = jvSolucoess`);

        const query = `SELECT e.nome as empresa_nome, c.pessoa_id as id_consultor, p.nome as pessoa_nome, p.contato as pessoa_contato, 
                       p.email as pessoa_email, c.senha as consultor_senha
                       FROM empresa e 
                       INNER JOIN consultor c ON e.id = c.empresa_id 
                       INNER JOIN pessoa p ON c.pessoa_id = p.id
                       WHERE p.nome = :nomeConsultor`;
        const result = await connection.execute(query, [nomeConsultor]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Consultor não encontrado' });
        }

        const consultores = result.rows.map(row => ({
            empresa_nome: row[0],
            id_consultor: row[1],
            nome: row[2],
            contato: row[3],
            email: row[4],
            senha: row[5]
        }));

        res.json(consultores);

        await connection.close();
    } catch (error) {
        console.error('Erro ao buscar consultores:', error);
        res.status(500).json({ error: 'Erro ao buscar consultores' });
    }
});

// GET paises
app.get('/paises', async (req, res) => {
    try {
        const connection = await oracledb.getConnection(dbConfig);

        await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = jvSolucoess`);
        
        const query = `SELECT id, nome FROM pais`;
        const result = await connection.execute(query);

        const paises = result.rows.map(row => ({
            id: row[0],
            nome: row[1]
        }));

        res.json(paises);
        await connection.close();
    } catch (error) {
        console.error('Erro ao buscar países:', error);
        res.status(500).json({ error: 'Erro ao buscar países' });
    }
});

// GET estados
app.get('/estados', async (req, res) => {
    try {
        const connection = await oracledb.getConnection(dbConfig);

        await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = jvSolucoess`);
        
        const query = `SELECT id, nome FROM estado`;
        const result = await connection.execute(query);

        const estados = result.rows.map(row => ({
            id: row[0],
            nome: row[1]
        }));

        res.json(estados);

        await connection.close();
    } catch (error) {
        console.error('Erro ao buscar estados:', error);
        res.status(500).json({ error: 'Erro ao buscar estados' });
    }
});

// GET cidades
app.get('/cidades', async (req, res) => {
    try {
        const connection = await oracledb.getConnection(dbConfig);

        await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = jvSolucoess`);
        
        const query = `SELECT id, nome FROM cidade`;
        const result = await connection.execute(query);

        const cidades = result.rows.map(row => ({
            id: row[0],
            nome: row[1]
        }));

        res.json(cidades);

        await connection.close();
    } catch (error) {
        console.error('Erro ao buscar cidades:', error);
        res.status(500).json({ error: 'Erro ao buscar cidades' });
    }
});

// GET bairros
app.get('/bairros', async (req, res) => {
    try {
        const connection = await oracledb.getConnection(dbConfig);

        await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = jvSolucoess`);
        
        const query = `SELECT id, nome FROM bairro`;
        const result = await connection.execute(query);

        const bairros = result.rows.map(row => ({
            id: row[0],
            nome: row[1]
        }));

        res.json(bairros);
        
        await connection.close();
    } catch (error) {
        console.error('Erro ao buscar bairros:', error);
        res.status(500).json({ error: 'Erro ao buscar bairros' });
    }
});

// GET localidades (De local de descarte até país)
app.get('/localidades', async (req, res) => {
    try {
        const connection = await oracledb.getConnection(dbConfig);

        await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = jvSolucoess`);

        const query = `SELECT l.id AS localidade_id, l.nome AS localidade_nome, l.horario_funcionamento, e.rua, e.numero, e.complemento, 
                      b.nome AS bairro_nome, c.nome AS cidade_nome, es.nome AS estado_nome, p.nome AS pais_nome FROM local_descarte l
                      JOIN endereco e ON l.endereco_id = e.id
                      JOIN bairro b ON e.bairro_id = b.id
                      JOIN cidade c ON b.cidade_id = c.id
                      JOIN estado es ON c.estado_id = es.id
                      JOIN pais p ON es.pais_id = p.id`;
        const result = await connection.execute(query);

        const localidades = result.rows.map(row => ({
            id: row[0],
            nome: row[1],
            horario_funcionamento: row[2],
            endereco: {
                rua: row[3],
                numero: row[4],
                complemento: row[5],
                bairro: row[6],
                cidade: row[7],
                estado: row[8],
                pais: row[9],
            }
        }));

        res.json(localidades);

        await connection.close();
    } catch (error) {
        console.error('Erro ao buscar localidades:', error);
        res.status(500).json({ error: 'Erro ao buscar localidades' });
    }
});

// GET itensdescarte
app.get('/itensdescarte', async (req, res) => {
    try {
        const connection = await oracledb.getConnection(dbConfig);

        await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = jvSolucoess`);

        const query = `SELECT id, nome, descricao, riscos FROM item_descarte`;
        const result = await connection.execute(query);

        const itensDescarte = result.rows.map(row => ({
            id: row[0],
            nome: row[1],
            descricao: row[2],
            riscos: row[3]
        }));

        res.json(itensDescarte);

        await connection.close();
    } catch (error) {
        console.error('Erro ao buscar itens de descarte:', error);
        res.status(500).json({ error: 'Erro ao buscar itens de descarte' });
    }
});

// GET Localidades por item de descarte
app.get('/itensdescarte/:id/localidades', async (req, res) => {
    try {
        const { id } = req.params;

        const connection = await oracledb.getConnection(dbConfig);

        await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = jvSolucoess`);

        const query = `SELECT l.id, l.nome, l.horario_funcionamento, e.rua, e.numero, e.complemento, 
                       b.nome AS bairro, c.nome AS cidade, es.nome AS estado, p.nome AS pais FROM local_descarte l
                       JOIN endereco e ON l.endereco_id = e.id
                       JOIN bairro b ON e.bairro_id = b.id
                       JOIN cidade c ON b.cidade_id = c.id
                       JOIN estado es ON c.estado_id = es.id
                       JOIN pais p ON es.pais_id = p.id
                       JOIN local_item_descarte lid ON l.id = lid.local_descarte_id
                       WHERE lid.item_descarte_id = :id`;
        const result = await connection.execute(query, [id]);

        const localidades = result.rows.map(row => ({
            id: row[0],
            nome: row[1],
            horario_funcionamento: row[2],
            endereco: {
                rua: row[3],
                numero: row[4],
                complemento: row[5],
                bairro: row[6],
                cidade: row[7],
                estado: row[8],
                pais: row[9],
            }
        }));

        res.json(localidades);

        await connection.close();
    } catch (error) {
        console.error('Erro ao buscar localidades do item:', error);
        res.status(500).json({ error: 'Erro ao buscar localidades do item' });
    }
});

// GET contatos_consultoria
app.get('/contatos_consultoria', async (req, res) => {
    try {
        const connection = await oracledb.getConnection(dbConfig);

        await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = jvSolucoess`);

        const query = `SELECT cc.id AS contato_id, p.nome AS nome, p.contato AS celular, p.email AS email, cc.motivo AS motivo, cc.detalhes AS detalhes
                       FROM contato_consultoria cc
                       INNER JOIN usuario u ON cc.usuario_pessoa_id = u.pessoa_id
                       INNER JOIN pessoa p ON u.pessoa_id = p.id`;
        const result = await connection.execute(query);

        const contatos = result.rows.map(row => ({
            id: row[0],
            nome: row[1],
            celular: row[2],
            email: row[3],
            motivo: row[4],
            detalhes: row[5]
        }));

        res.json(contatos);

        await connection.close();
    } catch (error) {
        console.error('Erro ao buscar contatos de consultoria:', error);
        res.status(500).json({ error: 'Erro ao buscar contatos de consultoria' });
    } 
});

// GET respostas
app.get('/respostas', async (req, res) => {
    try {
        const connection = await oracledb.getConnection(dbConfig);

        await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = jvSolucoess`);

        const query = `SELECT r.id, r.descricao, r.contato_consultoria_id, r.consultor_pessoa_id, p.nome AS consultor_nome
                       FROM resposta r
                       INNER JOIN consultor c ON r.consultor_pessoa_id = c.pessoa_id
                       INNER JOIN pessoa p ON c.pessoa_id = p.id`;
        const result = await connection.execute(query);

        const respostas = result.rows.map(row => ({
            id: row[0],
            descricao: row[1],
            contato_consultoria_id: row[2],
            consultor_pessoa_id: row[3],
            consultor_nome: row[4]
        }));

        res.json(respostas);

        await connection.close();
    } catch (error) {
        console.error('Erro ao buscar respostas:', error);
        res.status(500).json({ error: 'Erro ao buscar respostas' });
    } 
});

// POST contato_consultoria
app.post('/contato_consultoria', async (req, res) => {
    const connection = await oracledb.getConnection(dbConfig);

    try {
        const { nome, contato, email, motivo, detalhes } = req.body;      

        await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = jvSolucoess`);

        const insertPessoaQuery = `INSERT INTO pessoa (nome, contato, email) VALUES (:nome, :contato, :email) RETURNING id INTO :id`;
        const pessoaResult = await connection.execute(insertPessoaQuery, { nome, contato, email, id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } });

        const pessoaId = pessoaResult.outBinds.id[0];

        await connection.execute(`COMMIT`);

        const insertUsuarioQuery = `INSERT INTO usuario (pessoa_id) VALUES (:pessoaId)`;
        await connection.execute(insertUsuarioQuery, { pessoaId });

        await connection.execute(`COMMIT`);

        const insertContatoQuery = `INSERT INTO contato_consultoria (motivo, detalhes, usuario_pessoa_id) VALUES (:motivo, :detalhes, :pessoaId)`;
        await connection.execute(insertContatoQuery, { motivo, detalhes, pessoaId });

        await connection.execute(`COMMIT`);

        res.status(201).json({ message: 'Contato cadastrado com sucesso!' });

        await connection.close();
    } catch (error) {
        console.error('Erro ao enviar contato:', error);
        
        if (connection) {
            try {
                await connection.execute(`ROLLBACK`);
            } catch (rollbackError) {
                console.error('Erro ao executar rollback:', rollbackError);
            }
        }
      
        res.status(500).json({ error: 'Erro ao enviar contato' });
    } 
});

// POST item_descarte
app.post('/item_descarte', async (req, res) => {
    const connection = await oracledb.getConnection(dbConfig);

    try {
        const { nome, descricao, riscos} = req.body;

        await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = jvSolucoess`);

        const insertItemQuery = `INSERT INTO item_descarte (nome, descricao, riscos, empresa_id) VALUES (:nome, :descricao, :riscos, 1)`;
        await connection.execute(insertItemQuery, { nome, descricao, riscos });

        await connection.execute(`COMMIT`);

        res.status(201).json({ message: 'Item de descarte cadastrado com sucesso!'});

        await connection.close();
    } catch (error) {
        console.error('Erro ao cadastrar item de descarte:', error);
        
        if (connection) {
            try {
                await connection.execute(`ROLLBACK`);
            } catch (rollbackError) {
                console.error('Erro ao executar rollback:', rollbackError);
            }
        }
        
        res.status(500).json({ error: 'Erro ao cadastrar item de descarte' });
    } 
});

// POST local_descarte
app.post('/local_descarte', async (req, res) => {
    const connection = await oracledb.getConnection(dbConfig);

    try {
        const { nome, horario_funcionamento, rua, numero, complemento, bairro, cidade, estado, pais } = req.body;

        await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = jvSolucoess`);

        let paisId;
        const selectPais = `SELECT id FROM pais WHERE nome = :pais`
        const paisSelectResult = await connection.execute(selectPais, { pais });

        if (paisSelectResult.rows.length > 0) {
            paisId = paisSelectResult.rows[0][0];
        } else {
            const insertPaisQuery = `INSERT INTO pais (nome) VALUES (:pais) RETURNING id INTO :id`;
            const paisResult = await connection.execute( insertPaisQuery , { pais, id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } });

            paisId = paisResult.outBinds.id[0];

            await connection.execute(`COMMIT`);
        }

        let estadoId;
        const selectEstado = `SELECT id FROM estado WHERE nome = :estado`
        const estadoSelectResult = await connection.execute(selectEstado, { estado });

        if (estadoSelectResult.rows.length > 0) {
            estadoId = estadoSelectResult.rows[0][0];
        } else {
            const insertEstadoQuery = `INSERT INTO estado (nome, pais_id) VALUES (:estado, :paisId) RETURNING id INTO :id`
            const estadoResult = await connection.execute(insertEstadoQuery, { estado, paisId, id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } });

            estadoId = estadoResult.outBinds.id[0];

            await connection.execute(`COMMIT`);
        }

        let cidadeId;
        const selectCidade = `SELECT id FROM cidade WHERE nome = :cidade`
        const cidadeSelectResult = await connection.execute(selectCidade, { cidade });

        if (cidadeSelectResult.rows.length > 0) {
            cidadeId = cidadeSelectResult.rows[0][0];
        } else {
            const insertCidadeQuery = `INSERT INTO cidade (nome, estado_id) VALUES (:cidade, :estadoId) RETURNING id INTO :id`
            const cidadeResult = await connection.execute(insertCidadeQuery, { cidade, estadoId, id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } });

            cidadeId = cidadeResult.outBinds.id[0];

            await connection.execute(`COMMIT`);
        }

        let bairroId;
        const selectBairro = `SELECT id FROM bairro WHERE nome = :bairro`
        const bairroSelectResult = await connection.execute(selectBairro, { bairro });

        if (bairroSelectResult.rows.length > 0) {
            bairroId = bairroSelectResult.rows[0][0];
        } else {
            const insertBairroQuery = `INSERT INTO bairro (nome, cidade_id) VALUES (:bairro, :cidadeId) RETURNING id INTO :id`
            const bairroResult = await connection.execute(insertBairroQuery, { bairro, cidadeId, id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } });

            bairroId = bairroResult.outBinds.id[0];

            await connection.execute(`COMMIT`);
        }

        const insertEnderecoQuery = `INSERT INTO endereco (rua, numero, complemento, bairro_id) VALUES (:rua, :numero, :complemento, :bairroId) RETURNING id INTO :id`
        const enderecoResult = await connection.execute(insertEnderecoQuery, { rua, numero, complemento, bairroId, id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } });

        const enderecoId = enderecoResult.outBinds.id[0];

        await connection.execute(`COMMIT`);

        const insertLocalDescarteQuery = `INSERT INTO local_descarte (nome, horario_funcionamento, endereco_id) VALUES (:nome, :horario_funcionamento, :enderecoId)`
        await connection.execute(insertLocalDescarteQuery, { nome, horario_funcionamento, enderecoId });

        await connection.execute(`COMMIT`);

        res.status(201).json({ message: 'Local de descarte cadastrado com sucesso!' });

        await connection.close();
    } catch (error) {
        console.error('Erro ao cadastrar local de descarte:', error);
        
        if (connection) {
            try {
                await connection.execute(`ROLLBACK`);
            } catch (rollbackError) {
                console.error('Erro ao executar rollback:', rollbackError);
            }
        }
        
        res.status(500).json({ error: 'Erro ao cadastrar local de descarte' });
    } 
});

// POST local_item_descarte
app.post('/local_item_descarte', async (req, res) => {
    const connection = await oracledb.getConnection(dbConfig);

    try {
        const { idItemDescarte, idLocalDescarte } = req.body;

        await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = jvSolucoess`);

        const insertPaisQuery = `INSERT INTO local_item_descarte (item_descarte_id, local_descarte_id) VALUES (:idItemDescarte, :idLocalDescarte) `;
        await connection.execute( insertPaisQuery , { idItemDescarte, idLocalDescarte });

        await connection.execute(`COMMIT`);

        res.status(201).json({ message: 'Local de descarte ao item de descarte cadastrado com sucesso!' });

        await connection.close();
    } catch (error) {
        console.error('Erro ao cadastrar local de descarte ao item de descarte:', error);
        
        if (connection) {
            try {
                await connection.execute(`ROLLBACK`);
            } catch (rollbackError) {
                console.error('Erro ao executar rollback:', rollbackError);
            }
        }
        
        res.status(500).json({ error: 'Erro ao cadastrar local de descarte ao item de descarte' });
    } 
});

// POST resposta_contato
app.post('/resposta_contato', async (req, res) => {
    const connection = await oracledb.getConnection(dbConfig);

    try {
        const { resposta, contato_consultoria_id, consultor_id } = req.body;

        await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = jvSolucoess`);

        const insertRespostaQuery = `INSERT INTO resposta (descricao, contato_consultoria_id, consultor_pessoa_id) 
                                     VALUES (:resposta, :contato_consultoria_id, :consultor_id) `;
        await connection.execute( insertRespostaQuery , { resposta, contato_consultoria_id, consultor_id });

        await connection.execute(`COMMIT`);

        res.status(201).json({ message: 'resposta cadastrada com sucesso!' });

        await connection.close();
    } catch (error) {
        console.error('Erro ao cadastrar resposta:', error);
        
        if (connection) {
            try {
                await connection.execute(`ROLLBACK`);
            } catch (rollbackError) {
                console.error('Erro ao executar rollback:', rollbackError);
            }
        }
        
        res.status(500).json({ error: 'Erro ao cadastrar resposta' });
    } 
});

// PUT item_descarte
app.put('/item_descarte/:id', async (req, res) => {
    const connection = await oracledb.getConnection(dbConfig);

    try {
        const { id } = req.params;
        const { nome, descricao, riscos } = req.body;
        const { locais } = req.body;

        await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = jvSolucoess`);

        const updateItemQuery = `UPDATE item_descarte SET nome = :nome, descricao = :descricao, riscos = :riscos WHERE id = :id`;
        await connection.execute(updateItemQuery, { nome, descricao, riscos, id });

        const deleteLocaisQuery = `DELETE FROM local_item_descarte WHERE ITEM_DESCARTE_ID = :id`;
        await connection.execute(deleteLocaisQuery, [id]);

        const addLocaisQuery = `INSERT INTO local_item_descarte (ITEM_DESCARTE_ID, LOCAL_DESCARTE_ID) VALUES (:idItemDescarte, :idLocalDescarte)`;
        if (locais) {
            for (const localId of locais) {
                await connection.execute(addLocaisQuery, [id, localId]);
            }
        }

        await connection.execute(`COMMIT`);

        res.status(200).json({ message: 'Item de descarte atualizado com sucesso!' });

        await connection.close();
    } catch (error) {
        console.error('Erro ao atualizar item de descarte:', error);

        if (connection) {
            try {
                await connection.execute(`ROLLBACK`);
            } catch (rollbackError) {
                console.error('Erro ao executar rollback:', rollbackError);
            }
        }

        res.status(500).json({ error: 'Erro ao atualizar item de descarte' });
    }
});

// DELETE item_descarte
app.delete('/item_descarte/:id', async (req, res) => {
    const connection = await oracledb.getConnection(dbConfig);

    try {
        const { id } = req.params;

        await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = jvSolucoess`);

        const checkAssociationQuery = `SELECT COUNT(*) AS total FROM local_item_descarte WHERE item_descarte_id = :id`;
        const associationResult = await connection.execute(checkAssociationQuery, { id });
        const totalAssociations = associationResult.rows[0][0];

        if (totalAssociations > 0) {
            const deleteAssociationQuery = `DELETE FROM local_item_descarte WHERE item_descarte_id = :id`;
            await connection.execute(deleteAssociationQuery, { id });
        }

        const deleteItemQuery = `DELETE FROM item_descarte WHERE id = :id`;
        await connection.execute(deleteItemQuery, { id });

        await connection.execute(`COMMIT`);

        res.status(200).json({ message: 'Item de descarte deletado com sucesso!' });

        await connection.close();
    } catch (error) {
        console.error('Erro ao deletar item de descarte:', error);

        if (connection) {
            try {
                await connection.execute(`ROLLBACK`);
            } catch (rollbackError) {
                console.error('Erro ao executar rollback:', rollbackError);
            }
        }

        res.status(500).json({ error: 'Erro ao deletar item de descarte' });
    }
});

// DELETE local_descarte
app.delete('/local_descarte/:id', async (req, res) => {
    const connection = await oracledb.getConnection(dbConfig);

    try {
        const { id } = req.params;

        await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = jvSolucoess`);

        const checkAssociationQuery = `SELECT COUNT(*) AS total FROM local_item_descarte WHERE local_descarte_id = :id`;
        const associationResult = await connection.execute(checkAssociationQuery, { id });
        const totalAssociations = associationResult.rows[0][0];

        if (totalAssociations > 0) {
            return res.status(400).json({ error: 'Este local de descarte possui itens associados e não pode ser excluído.' });
        }

        const deleteLocalQuery = `DELETE FROM local_descarte WHERE id = :id`;
        await connection.execute(deleteLocalQuery, { id });

        await connection.execute(`COMMIT`);

        res.status(200).json({ message: 'Local de descarte excluído com sucesso!' });

        await connection.close();
    } catch (error) {
        console.error('Erro ao excluir local de descarte:', error);

        if (connection) {
            try {
                await connection.execute(`ROLLBACK`);
            } catch (rollbackError) {
                console.error('Erro ao executar rollback:', rollbackError);
            }
        }

        res.status(500).json({ error: 'Erro ao excluir local de descarte' });
    }
});

// DELETE local_item_descarte
app.delete('/local_item_descarte/:idItemDescarte/:idLocalDescarte', async (req, res) => {
    const connection = await oracledb.getConnection(dbConfig);

    try {
        const { idItemDescarte, idLocalDescarte } = req.params;

        await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = jvSolucoess`);

        const deleteLocalItemDescarteQuery = `DELETE FROM local_item_descarte 
                                              WHERE item_descarte_id = :idItemDescarte AND local_descarte_id = :idLocalDescarte`;
        await connection.execute(deleteLocalItemDescarteQuery, { idItemDescarte, idLocalDescarte });

        await connection.execute(`COMMIT`);

        res.status(200).json({ message: 'Associação entre item de descarte e local de descarte excluída com sucesso!' });

        await connection.close();
    } catch (error) {
        console.error('Erro ao excluir associação entre item de descarte e local de descarte:', error);

        if (connection) {
            try {
                await connection.execute(`ROLLBACK`);
            } catch (rollbackError) {
                console.error('Erro ao executar rollback:', rollbackError);
            }
        }

        res.status(500).json({ error: 'Erro ao excluir associação entre item de descarte e local de descarte' });
    }
});

// POST login
app.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        const connection = await oracledb.getConnection(dbConfig);

        await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = jvSolucoess`);

        const query = `SELECT p.email, c.senha FROM consultor c INNER JOIN pessoa p ON c.pessoa_id = p.id WHERE p.email = :email AND c.senha = :senha`;
        const result = await connection.execute(query, { email, senha });

        await connection.close();

        if (result.rows.length > 0) {
            const [userEmail] = result.rows[0];

            const token = jwt.sign({ email: userEmail }, secretKey, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).send('Credenciais inválidas');
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

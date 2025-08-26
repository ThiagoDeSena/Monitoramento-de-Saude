const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../db.js');

// Rota para salvar registro de glicemia
router.post("/glucose", async (req, res) => {
    const { user_id, date, glucose, observations_glicemia } = req.body;

    // Validações básicas
    if (!user_id || !date || !glucose) {
        return res.status(400).json({
            success: false,
            message: "Dados obrigatórios: user_id, date e glucose"
        });
    }

    try {
        // Verifica se já existe registro para esta data
        const { data: existingRecord } = await supabaseAdmin
            .from("health_records")
            .select("id")
            .eq("user_id", user_id)
            .eq("date", date)
            .single();

        if (existingRecord) {
            // Atualiza registro existente
            const { error: updateError } = await supabaseAdmin
                .from("health_records")
                .update({
                    glucose,
                    observations_glicemia,
                    created_at: new Date().toISOString()
                })
                .eq("id", existingRecord.id);

            if (updateError) {
                return res.status(400).json({ success: false, message: updateError.message });
            }
        } else {
            // Cria novo registro
            const { error: insertError } = await supabaseAdmin
                .from("health_records")
                .insert([{ user_id, date, glucose, observations_glicemia }]);

            if (insertError) {
                return res.status(400).json({ success: false, message: insertError.message });
            }
        }

        return res.json({ success: true, message: "Registro salvo com sucesso!" });

    } catch (err) {
        console.error("Erro ao salvar registro:", err);
        return res.status(500).json({ success: false, message: "Erro interno do servidor" });
    }
});

// Rota para verificar se já existe registro na data
router.get("/check-date", async (req, res) => {
    const { user_id, date } = req.query;

    if (!user_id || !date) {
        return res.status(400).json({ success: false, message: "user_id e date são obrigatórios" });
    }

    try {
        const { data, error } = await supabaseAdmin
            .from("health_records")
            .select("id")
            .eq("user_id", user_id)
            .eq("date", date)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = não encontrado
            return res.status(400).json({ success: false, message: error.message });
        }

        return res.json({ success: true, exists: !!data });

    } catch (err) {
        console.error("Erro ao verificar data:", err);
        return res.status(500).json({ success: false, message: "Erro interno do servidor" });
    }
});

module.exports = router;
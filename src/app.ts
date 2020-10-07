import express from 'express'

export const app = express();
app.get('/acme-apptemplatenode/', (req,res) => res.send('Express + TypeScript Server'));

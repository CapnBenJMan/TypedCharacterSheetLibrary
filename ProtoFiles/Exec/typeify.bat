@echo off


call tsc -p typeifyTSC.json

call npx prettier --config "./.prettierrc.json" -w "../ProtoGS/Types/*.d.ts"

call ts-node ArrangeTypes.ts
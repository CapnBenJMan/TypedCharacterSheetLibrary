@echo off


call tsc -p typeifyTSC.json

call ts-node ArrangeTypes.ts

call npx prettier --config ./.prettierrc.json -w "../ProtoGS/CSCTypes.d.ts"
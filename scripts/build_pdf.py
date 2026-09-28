"""Consolida a documentação da entrega em PDF, com diagrama vetorial."""
from pathlib import Path
import re
from html import escape
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, Flowable, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'output/pdf'; OUT.mkdir(parents=True,exist_ok=True)
TARGET=OUT/'Onde-Foi-Meu-Dinheiro-Entrega-01.pdf'
GREEN=colors.HexColor('#174c42'); INK=colors.HexColor('#263d35'); MUTED=colors.HexColor('#576653'); PALE=colors.HexColor('#edf3e7'); LINE=colors.HexColor('#dbe3d5')
FONT=Path('C:/Windows/Fonts')
for name,file in [('Body','arial.ttf'),('Body-Bold','arialbd.ttf'),('Body-Italic','ariali.ttf')]:
    pdfmetrics.registerFont(TTFont(name,str(FONT/file)))
pdfmetrics.registerFontFamily('Body',normal='Body',bold='Body-Bold',italic='Body-Italic',boldItalic='Body-Bold')
styles=getSampleStyleSheet()
styles.add(ParagraphStyle('P',fontName='Body',fontSize=9.6,leading=14,textColor=INK,spaceAfter=7))
styles.add(ParagraphStyle('SmallP',parent=styles['P'],fontSize=8,leading=11))
styles.add(ParagraphStyle('TitleP',parent=styles['P'],fontName='Body-Bold',fontSize=27,leading=32,textColor=GREEN,spaceAfter=18,keepWithNext=True))
styles.add(ParagraphStyle('H2P',parent=styles['P'],fontName='Body-Bold',fontSize=14,leading=18,textColor=GREEN,spaceBefore=14,spaceAfter=9,keepWithNext=True))
styles.add(ParagraphStyle('H3P',parent=styles['P'],fontName='Body-Bold',fontSize=11,leading=15,spaceBefore=9,keepWithNext=True))
styles.add(ParagraphStyle('Cell',parent=styles['P'],fontSize=8,leading=11,spaceAfter=0))
styles.add(ParagraphStyle('CellHead',parent=styles['Cell'],fontName='Body-Bold',textColor=colors.white))
styles.add(ParagraphStyle('BulletP',parent=styles['P'],leftIndent=11,firstLineIndent=-8))
styles.add(ParagraphStyle('Cover',parent=styles['P'],fontName='Body-Bold',fontSize=39,leading=44,textColor=GREEN,spaceAfter=24))

REPO='https://github.com/JonathanSM-dev/onde-foi-meu-dinheiro'
PROTO='https://jonathansm-dev.github.io/onde-foi-meu-dinheiro/prototipo/'
def markup(text):
    text=text.replace('‑','-').replace('–','-').replace('—','-').replace('→',' > ').replace('✓','OK')
    tokens=[]
    def link(match):
        label,target=match.groups()
        if not target.startswith(('https://','http://')):
            target=REPO+'/blob/main/docs/'+target
        tokens.append(f'<link href="{escape(target,quote=True)}" color="#174c42"><u>{escape(label)}</u></link>')
        return f'ZZLINK{len(tokens)-1}ZZ'
    text=re.sub(r'\[([^\]]+)\]\(([^)]+)\)',link,text)
    text=escape(text)
    text=re.sub(r'\*\*(.+?)\*\*',r'<b>\1</b>',text)
    text=re.sub(r'`([^`]+)`',r'<font name="Body-Bold">\1</font>',text)
    for i,value in enumerate(tokens):text=text.replace(f'ZZLINK{i}ZZ',value)
    return text

class ModelDiagram(Flowable):
    def __init__(self):super().__init__();self.width=487;self.height=325
    def draw(self):
        c=self.canv
        def box(x,y,w,h,title,lines):
            c.setFillColor(PALE);c.setStrokeColor(LINE);c.roundRect(x,y,w,h,8,fill=1,stroke=1)
            c.setFillColor(GREEN);c.setFont('Body-Bold',10);c.drawString(x+11,y+h-20,title)
            c.setFillColor(INK);c.setFont('Body',8)
            for i,line in enumerate(lines):c.drawString(x+11,y+h-36-i*12,line)
        def arrow(x1,y1,x2,y2):
            c.setStrokeColor(MUTED);c.setLineWidth(1);c.line(x1,y1,x2,y2)
            if y2<y1:c.line(x2,y2,x2-3,y2+5);c.line(x2,y2,x2+3,y2+5)
            else:c.line(x2,y2,x2-5,y2-3);c.line(x2,y2,x2-5,y2+3)
        box(172,247,145,61,'USUÁRIO',['uid · identidade autenticada'])
        box(172,154,145,61,'CATEGORIA',['id · usuarioId · tipo'])
        arrow(244,247,244,215);c.setFont('Body',8);c.drawString(253,230,'1 : N')
        box(0,30,145,80,'RECORRÊNCIA',['id · usuarioId','dia · valorCentavos','mesInicial'])
        box(172,30,145,80,'LANÇAMENTO',['id · usuarioId','categoriaId · valorCentavos','recorrenciaId (opcional)'])
        box(344,30,143,80,'ORÇAMENTO',['categoriaId + mês','usuarioId','limiteCentavos'])
        c.setStrokeColor(MUTED);c.line(244,154,244,137);c.line(72,137,415,137)
        for x in [72,244,415]:
            arrow(x,137,x,110);c.setFillColor(MUTED);c.setFont('Body',8);c.drawString(x+6,119,'1 : N')
        arrow(145,60,172,60)
        c.setFont('Body',7);c.drawString(128,17,'origem opcional: uma recorrência gera até um lançamento por mês')
        c.setFont('Body',8);c.drawString(0,2,'Propriedade: usuário 1 : N para cada entidade; todas as referências ficam no mesmo UID.')

def table(rows):
    n=len(rows[0]); widths={2:[139,348],3:[67,165,255],4:[40,75,207,165]}.get(n,[487/n]*n)
    if n==3 and rows[0][0]=='Entidade':widths=[83,225,179]
    if n==3 and rows[0][0]=='Responsabilidade':widths=[103,205,179]
    cells=[[Paragraph(markup(x),styles['CellHead' if i==0 else 'Cell']) for x in row] for i,row in enumerate(rows)]
    t=Table(cells,colWidths=widths,repeatRows=1,hAlign='LEFT')
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),GREEN),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,colors.HexColor('#f5f7f1')]),('LINEBELOW',(0,0),(-1,0),.5,GREEN),('LINEBELOW',(0,1),(-1,-1),.3,LINE)]))
    return t

def parse_md(path):
    lines=path.read_text(encoding='utf-8').splitlines(); result=[];i=0
    while i<len(lines):
        line=lines[i].strip()
        if not line:i+=1;continue
        if line.startswith('```'):
            is_diagram='mermaid' in line;i+=1;code=[]
            while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
            if is_diagram:result.extend([ModelDiagram(),Spacer(1,10)])
            else:result.append(Paragraph('<br/>'.join(escape(s) for s in code),styles['SmallP']))
            i+=1;continue
        if line.startswith('|'):
            rows=[]
            while i<len(lines) and lines[i].strip().startswith('|'):
                row=[x.strip() for x in lines[i].strip().strip('|').split('|')]
                if not all(re.fullmatch(r'[:\- ]+',x) for x in row):rows.append(row)
                i+=1
            result.extend([table(rows),Spacer(1,9)]);continue
        if line.startswith('# '):result.append(Paragraph(markup(line[2:]),styles['TitleP']))
        elif line.startswith('## '):result.append(Paragraph(markup(line[3:]),styles['H2P']))
        elif line.startswith('### '):result.append(Paragraph(markup(line[4:]),styles['H3P']))
        elif line.startswith('- '):result.append(Paragraph('- '+markup(line[2:]),styles['BulletP']))
        elif re.match(r'^\d+\. ',line):result.append(Paragraph(markup(line),styles['BulletP']))
        else:
            chunk=[line];i+=1
            while i<len(lines) and lines[i].strip() and not re.match(r'^(#|\||-|\d+\.|```)',lines[i].strip()):chunk.append(lines[i].strip());i+=1
            result.append(Paragraph(markup(' '.join(chunk)),styles['P']));continue
        i+=1
    return result

def page_frame(c,doc):
    c.saveState();w,h=doc.pagesize
    if doc.page>1:
        c.setStrokeColor(LINE);c.line(54,h-40,w-54,h-40)
        c.setFont('Body',8);c.setFillColor(MUTED);c.drawString(54,h-31,'ONDE FOI MEU DINHEIRO  /  PRIMEIRA ENTREGA')
    c.setStrokeColor(LINE);c.line(54,43,w-54,43)
    c.setFont('Body',8);c.setFillColor(MUTED);c.drawString(54,29,'UTFPR · Engenharia de Software · 2026/2')
    c.drawRightString(w-54,29,str(doc.page));c.restoreState()

story=[Spacer(1,32),Paragraph('PRIMEIRA ENTREGA  /  27 SET 2026',styles['SmallP']),Spacer(1,32),Paragraph('Onde Foi<br/>Meu Dinheiro',styles['Cover']),Paragraph('Registrar com menos esforço.<br/>Entender o destino do dinheiro.',styles['H2P']),Spacer(1,35),Paragraph('Documento de produto, arquitetura e prototipação',styles['P']),Spacer(1,25)]
for name in ['Cecília Scharnovski','Hellen Caroline','Jonathan Silva Machado','Nicolas da Gama']:story.append(Paragraph(name,styles['P']))
story.extend([Spacer(1,30),Paragraph('Universidade Tecnológica Federal do Paraná<br/>Campus Dois Vizinhos · Bacharelado em Engenharia de Software<br/>Programação para Dispositivos Móveis<br/>Prof. Dr. Marlon Marcon',styles['P']),Spacer(1,25),Paragraph('Protótipo demonstrativo com dados fictícios. Integrações reais previstas para as próximas etapas.',styles['SmallP']),PageBreak()])
story.extend([Paragraph('Leia e explore',styles['TitleP']),Paragraph('Este documento reúne os artefatos da primeira etapa. O protótipo pode ser percorrido online; o ZIP preserva uma cópia independente e as fontes editáveis.',styles['P']),Paragraph(f'<link href="{PROTO}" color="#174c42"><b><u>Abrir protótipo navegável</u></b></link>',styles['P']),Paragraph(f'<link href="{REPO}" color="#174c42"><b><u>Abrir repositório GitHub</u></b></link>',styles['P']),Spacer(1,16),table([['Parte','O que avaliar'],['PRD','Problema, público, escopo, requisitos, regras e critérios de aceitação.'],['Arquitetura','Quatro decisões adotadas; alternativas e consequências, incluindo custo.'],['Modelagem','Diagrama, entidades, isolamento por usuário e exemplo do registro ao orçamento.'],['Protótipo','Dez telas; revisão compacta, edição sob demanda, cancelamento e falhas.'],['Apêndice: diário','Pedidos, resultados, escolhas e correções efetivamente registrados.']]),Spacer(1,16),Paragraph('Percurso sugerido',styles['H2P']),Paragraph('Início > Registrar > Texto > Organizar lançamento > Conferir cartão > Confirmar > Histórico. Para corrigir, use Editar detalhes. Nenhuma sugestão afeta os totais antes da confirmação.',styles['P']),Paragraph('Limites desta etapa',styles['H2P']),Paragraph('O protótipo não é o app React Native final. Login, câmera, IA e sincronização são simulados. A escolha de tecnologias foi verificada documentalmente, sem provisionar serviços. Confirmação do professor sobre a API externa e revisão conjunta do grupo permanecem pendentes.',styles['P'])])
for file in ['PRD.md','DECISOES-ARQUITETURA.md','MODELAGEM-DADOS.md','GUIA-DO-PROTOTIPO.md','DIARIO-DE-BORDO.md']:
    story.append(PageBreak());story.extend(parse_md(ROOT/'docs'/file))
doc=SimpleDocTemplate(str(TARGET),pagesize=(595.28,841.89),rightMargin=54,leftMargin=54,topMargin=59,bottomMargin=58,title='Onde Foi Meu Dinheiro - Primeira entrega',author='Cecília Scharnovski; Hellen Caroline; Jonathan Silva Machado; Nicolas da Gama')
doc.build(story,onFirstPage=page_frame,onLaterPages=page_frame)
print(TARGET)

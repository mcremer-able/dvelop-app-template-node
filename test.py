#!/usr/bin/env python
# coding: utf-8

# In[36]:

# dependencies

#pip install requests
#pip install pdfminer

#pip install yake

#pip install nltk
#nltk.download('stopwords')
#nltk.download('punkt')
#nltk.download('averaged_perceptron_tagger')

# In[37]:


import io
import json
import os
import sys

import requests
from pdfminer.layout import LAParams, LTTextBox
from pdfminer.pdfpage import PDFPage
from pdfminer.pdfinterp import PDFResourceManager
from pdfminer.pdfinterp import PDFPageInterpreter
from pdfminer.converter import PDFPageAggregator

import nltk
import yake


# In[38]:


def docdataurl(creds, dmsobj):
    baseurl, repo, _, apikey = creds
    headers = {
        'Accept': 'application/hal+json',
        'Origin': baseurl,
        'Authorization': 'Bearer ' + apikey,
        'Content-Type': 'application/json',
        'Accept-Language': 'de'}
    item_url = baseurl + "/dms/r/" + repo + "/o2m/" + dmsobj
    response = requests.request("GET", item_url, headers=headers)
    rawjson = json.loads(response.text)
    try:
        contentblob = rawjson["_links"]['pdfblobcontent']["href"]
    except:
        contentblob = rawjson["_links"]['mainblobcontent']["href"]
    headers2 = {
        'Accept': 'application/octet-stream',
        'Authorization': 'Bearer ' + apikey}
    content_url = baseurl + contentblob
    filestream = requests.request("GET", content_url, headers=headers2, stream=True)

    return filestream.content


# In[39]:


def pageanalyzer(dataobj):
    fp = io.BytesIO(dataobj)

    # Initialisieren
    rsrcmgr = PDFResourceManager()
    laparams = LAParams()
    device = PDFPageAggregator(rsrcmgr, laparams=laparams)
    interpreter = PDFPageInterpreter(rsrcmgr, device)
    pages = PDFPage.get_pages(fp)

    # Alle Layoutobjekte des Dokuments in eine Liste packen:
    all_lobj = []
    pagecount = 0
    pagedict = {}
    for page in pages:
        pagecount += 1
        interpreter.process_page(page)
        layout = device.get_result()
        contentlist = []
        dimlist = []
        for lobj in layout:
            if isinstance(lobj, LTTextBox):
                for llobj in lobj:
                    all_lobj.append(llobj)
                    x1, y1, x2, y2, text = llobj.bbox[0], llobj.bbox[1], llobj.bbox[2], llobj.bbox[3], llobj.get_text()
                    dimlist.append([int(x1), int(y1), int(x2), int(y2)])
                    contentlist.append(text)
            else:
                pass
        pagedims = [int(page.mediabox[2]), int(page.mediabox[3])]
        pagedata = [contentlist, dimlist, pagedims]
        pagedict[pagecount] = pagedata
    return pagedict

def pdf_to_text(dmsobj, creds):
    filestream = docdataurl(creds, dmsobj)
    result = pageanalyzer(filestream)

    textflowlist = []
    for page_content in result.values():
        textflowlist.extend(page_content[0])
    # bereinigen
    textflowlist = [i.replace('\n', '').strip() for i in textflowlist]
    textflowlist = [i for i in textflowlist if i]
    textflow = " ".join(textflowlist)
    return textflow


# In[64]:


if __name__ == "__main__":
    # creds hier auch als argument?
    creds = ['https://able-managment-hackaton.d-velop.cloud', 
             '0dbdff0f-ae8d-495e-a158-29a1d2a3bc82', 
             '_', 
             '0/g+vpxOZcgcwTUvrOCtzMXax20gG30RYmpHFuzlDMrDBP61WgJdjoRgzXQjqDAJKPPoQjpCCLfCetKD0qgj1SYVTFZ22TDjZhvsvca6BxI=&_z_A0V5ayCSs60TGZZnSpqTNV7lWvzxA_zyVKa4s-AbGjCifgcq_maAnIVye61PWMt5xH_jyFr8_887HZgCKhKivCGhITv5r']

    # ARG ist hier json-array
    inputarg = sys.argv[1]
    dmslist = inputarg.split(',')
    #dmslist = [i['id'] for i in json.loads(dms_json)['selectionList']]
    #dmslist = ["KO00000021"]
    imgurllist = []
    #imglist = []
    
    for dmsobj in dmslist:
        flowtext = (pdf_to_text(dmsobj, creds))

        try:
            # extract keywords
            tokenized = nltk.word_tokenize(flowtext)
            is_noun = lambda pos: pos[:2] == 'NN'
            nouns = [word for (word, pos) in nltk.pos_tag(tokenized) if is_noun(pos)] 
            flownouns = " ".join(nouns)
            kw_extractor = yake.KeywordExtractor(top=1, stopwords=None)
            keywords = kw_extractor.extract_keywords(flownouns)
            searchkey = keywords[0][0]
            searchstring = searchkey.replace(' ', ',')

            # keyword to img
            imgurllist.append("https://source.unsplash.com/random/300x300/?" + searchstring)

        except Exception as e:
            imgurllist.append("https://source.unsplash.com/random/300x300/?random")
    
    resultlist = ';'.join(imgurllist)
    print(resultlist)
        
    
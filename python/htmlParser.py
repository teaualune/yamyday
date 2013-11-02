# This Python file uses the following encoding: utf-8
from BeautifulSoup import BeautifulSoup, NavigableString
import urllib2
import sys
import re

def getContentWithUrl(url, source):
    search_resp = urllib2.urlopen(url)
    search_soup = BeautifulSoup(search_resp)
    search_title = ''
    search_content = ''
    search_content_result = ''
    search_imgUrl = ''
    reDic = {}
    if source == 'yahoo':
        search_title = search_soup.find("meta", {"property":"og:title"})['content']
        search_content = search_soup.find("div", {"id":"mediaarticlebody"})
        try:
            search_imgUrl = search_content.find("img")['src']
        except Exception, e:
            search_content_result=''
        for pContent in search_content.findAll("p"):
            search_content_result = search_content_result + pContent.text
        reDic['search_title'] = search_title
        reDic['search_content_result'] = search_content_result
        reDic['search_imgUrl'] = search_imgUrl
        return reDic
    if source =='ettoday':
        search_title = search_soup.find("h2", {"class":"title clearfix"}, {"itemprop":"headline"}).text
        search_content = search_soup.find("div", {"id":"story"})
        for pContent in search_content.findAll("p"):
            search_content_result = search_content_result + pContent.text
        reDic['search_title'] = search_title
        reDic['search_content_result'] = search_content_result
        reDic['search_imgUrl'] = ''
        return reDic
    if source =='nownews':
        search_title = search_soup.find("h1",{"itemprop":"headline"}).text
        search_content = search_soup.find("div", {"itemprop":"articleBody"})
        try:
            search_imgUrl = search_soup.find("div", {"class":"story_photo"}).find("img")['src']
        except Exception, e:
            search_content_result=''
        for pContent in search_content.findAll("p"):
            search_content_result = search_content_result + pContent.text
        reDic['search_title'] = search_title
        reDic['search_content_result'] = search_content_result
        reDic['search_imgUrl'] = search_imgUrl
        return reDic
    if source =='udn':
        search_title = search_soup.find("div", {"class":"story_title"}).text
        search_content = search_soup.find("div", {"id":"story"})
        for pContent in search_content.findAll("p"):
            search_content_result = search_content_result + pContent.text
        reDic['search_title'] = search_title
        reDic['search_content_result'] = search_content_result
        reDic['search_imgUrl'] = ''
        return reDic
    if source =='cna':
        search_title = search_soup.find("div",{"class":"news_content"}).find('h2').text
        search_content = search_soup.find("div",{"class":"news_content"})
        try:
            search_imgUrl = search_content.find("div", {"class":"box_1"}).find("img")['src']
        except Exception, e:
            search_content_result=''
        for pContent in search_content.findAll("p"):
            search_content_result = search_content_result + pContent.text
        reDic['search_title'] = search_title
        reDic['search_content_result'] = search_content_result
        reDic['search_imgUrl'] = search_imgUrl
        return reDic
    if source =='chinatimes':
        search_title = search_soup.find("div",{"class":"page_index"}).find('h1').text
        search_content = search_soup.find("div",{"class":"clear-fix"})
        try:
            search_imgUrl = search_content.find("div", {"class":"img_view"}).find("img")['src']
        except Exception, e:
            search_content_result=''
        for pContent in search_content.findAll("p"):
            search_content_result = search_content_result + pContent.text
        reDic['search_title'] = search_title
        reDic['search_content_result'] = search_content_result
        reDic['search_imgUrl'] = search_imgUrl
        return reDic

if __name__ == '__main__':
    getContentWithUrl('http://tw.news.yahoo.com/蘋果最新專利曝光-讓太陽幫你的iphone充電-094024840.html', 'yahoo')
    # getContentWithUrl('http://www.ettoday.net/news/20131102/290117.htm', "ettoday")
    # getContentWithUrl('http://www.nownews.com/n/2013/11/01/1008630', 'nownews')
    # getContentWithUrl('http://udn.com/NEWS/MAINLAND/MAI1/8268554.shtml', 'udn')
    # getContentWithUrl('http://www.cna.com.tw/topic/Popular/4084-1/201311010030-1.aspx', 'cna')
    # getContentWithUrl("http://www.chinatimes.com/realtimenews/美國洛杉磯機場發生槍擊案至少二人受傷-20131102001186-260408", 'chinatimes')
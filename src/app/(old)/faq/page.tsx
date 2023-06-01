'use client'
import React, { FC } from "react";
import SectionSliderCollections from "@/components/SectionSliderLargeProduct";
import SectionPromo1 from "@/components/SectionPromo1";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS } from "@/data/data";
import SidebarFilters from "@/components/SidebarFilters";
import AccordionInfoFaq from "@/components/AccordionInfoFaq";
import { useEffect, useState } from "react";

async function getFaqCategoryList(limit = 10, offset = 0) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/faq/faqCatList`;

  const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ offset, limit }),
      cache: 'no-store',
      headers: {
          'content-type': 'application/json',
          'current-time':'1679295158878',
          'hash': '10762887ec43657efa603ab4f80e0a1818a12bcc51472afba76bc5b2d30b8640'
      },
  });

  try {
      const data = await res.json();
      const { status, message } = data;
      if (status == 'failed') {
          throw new Error(message);
      }
      console.log(data);
      return data;
  } catch (error) {
      throw error;
  }
}

async function getFaqList(catId, limit = 10, offset = 0, sortBy = 'id', sortType = 'desc', type = 'PRODUCT', device='web') {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/faq/faqList`;

  const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({limit, offset, sortBy, sortType, type, device, catId}),
      cache: 'no-store',
      headers: {
        'content-type': 'application/json',
        'current-time':'1679295158878',
        'hash': '10762887ec43657efa603ab4f80e0a1818a12bcc51472afba76bc5b2d30b8640'
      },
  });

  if (!res.ok) {
      throw new Error('Failed to fetch slider list');
  }

  return await res.json();
}


const Faq = ({}) => {

  const [faqCategory, setFaqCategory] = useState(null)
  const [faqList, setFaqList] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(0)
  useEffect(()=>{

    getFaqCategoryList().then(data=>{
      setFaqCategory(data.output)
    })

    
  }, [])

  const category = (name)=>{
    console.log(name)
    setSelectedCategory(name)
  }

  useEffect(()=>{

    getFaqList(selectedCategory).then(data=>{
      console.log(data)
      setFaqList(data.output)
    })

  }, [selectedCategory])

  return (
    <div className={`nc-PageCollection2`}>
      <div className="container py-8 mb-28">
        <div className="space-y-6">
          {/* HEADING */}
          <div className="max-w-screen-sm">
            <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold">
              Faq
            </h2>
            <span className="block mt-4 text-neutral-500 dark:text-neutral-400 text-sm sm:text-base">
              Find the answer of your question
            </span>
          </div>
        
          <hr className="border-slate-200 dark:border-slate-700" />
          <main>
            {/* LOOP ITEMS */}
            
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/3 xl:w-1/4 pr-4">
                <SidebarFilters onCategorySelected={category} faqCategory={faqCategory}/>
              </div>
              <div className="flex-shrink-0 mb-10 lg:mb-0 lg:mx-4 border-t lg:border-t-0"></div>
              {/* <div className="flex-1 ">
                <div className="flex-1 grid sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10 ">
                  {PRODUCTS.map((item, index) => (
                    <ProductCard data={item} key={index} />
                    
                  ))}
                </div>
              </div> */}
                <AccordionInfoFaq data = {faqList}/>
            </div>
          </main>
        </div>

      </div>
    </div>
  );
};

export default Faq;

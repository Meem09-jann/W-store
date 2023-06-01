'use client';


import Image from 'next/image';

import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import ReactToPrint from 'react-to-print';


async function getInvoicePrintList(jwtToken: string, orderId: string, type: string) {
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/product/invoicePrintList2`;

    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            orderId,
            type,
        }),
        cache: 'no-store',
        headers: {
            'content-type': 'application/json',
            'x-access-token': jwtToken,
        },
    });

    try {
        const data = await res.json();
        const { status, message } = data;
        if (status == 'failed') {
            throw new Error(message);
        }
        return data.output;
    } catch (error) {
        throw error;
    }
}

export default function Page({ params: {orderId} }) {
    const componentRef = useRef<any>();
    const router = useRouter();
    const [cookies, setCookie] = useCookies(['jwtToken', 'refreshToken', 'profile']);
    const [product, setProduct] = useState<any>(null);
    const [invoicePrintList, setInvoicePrintList] = useState<any>({ output: [] });
    //const [invoicePrintList, setInvoicePrintList] = useState({ output: [] });
    const [reloadToggle, setReloadToggle] = useState(true);

    useEffect(() => {
        if (!cookies.jwtToken) {
            return router.push('/login');
        }

        let type = 'sell';
        getInvoicePrintList(cookies.jwtToken,orderId, type)
            .then((data) => {
                setInvoicePrintList(data);
            })
            .catch((error) => {
                throw error;
            });
    }, [cookies, router,orderId]);

    useEffect(() => {
        let invoiceFields = {
            totalprice: null,
            totalamount: null,
            date: null,
            products: [],
            buyerName: null,
            buyerId: null,
            sellerName: null,
            sellerId: null,
        };
        invoiceFields['totalprice'] = invoicePrintList.totalprice;
        invoiceFields['totalamount'] = invoicePrintList.totalProduct;
        invoiceFields['date'] = invoicePrintList.date;
        invoiceFields['products'] = invoicePrintList.products;
        invoiceFields['buyerName'] = invoicePrintList.buyerName;
        invoiceFields['buyerId'] = invoicePrintList.buyerId;
        invoiceFields['sellerName'] = invoicePrintList.sellerName;
        invoiceFields['sellerId'] = invoicePrintList.sellerId;

        //console.log(invoiceFields);
        setProduct(invoiceFields);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invoicePrintList]);
    if (!product || !product.products) {
        return <div className="text-center">Loading...</div>;
    }

    let rows = product.products.map(function (row) {
        return (
            <tr className="border-b border-slate-200" key={row.productId}>
                <td className="py-4 pl-4 pr-3 text-sm sm:pl-6 md:pl-0">
                    <div className="font-medium text-slate-700">{row.productId}</div>
                </td>
                <td className="hidden px-3 py-4 text-right text-sm text-slate-500 sm:table-cell">{row.name}</td>
                <td className="hidden px-3 py-4 text-right text-sm text-slate-500 sm:table-cell">{row.total_amount}</td>
                <td className="py-4 pl-3 pr-4 text-right text-sm text-slate-500 sm:pr-6 md:pr-0">{row.total_price}</td>
            </tr>
        );
    });
    //const inputEl = useRef(null);
    // const componentRef = React.useRef(null);
    // const handlePrint = useReactToPrint({
    //     content: () => componentRef.current,
    // });

    return (
        <div className='container py-20'>
            <ReactToPrint
                trigger={() => (
                    <button className="w-40 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700">
                        印刷
                    </button>
                )}
                content={() => componentRef.current}
            />
            <div className="max-w-screen overflow-auto">
                <section className="min-w-[40rem] bg-white" ref={componentRef}>
                    <div className="mx-auto max-w-5xl bg-white py-16">
                        <article className="overflow-hidden">
                            <div className="rounded-b-md bg-[white]">
                                <div className="p-9">
                                    <div className="space-y-6 text-slate-700">
                                        <Image src="/store-light-logo.png" alt={'W Live'} width={140} height={48}></Image>
                                    </div>
                                </div>
                                <div className="p-9">
                                    <div className="flex w-full">
                                        <div className="grid grid-cols-4 gap-12">
                
                                            <div className="text-sm font-light text-slate-500">
                                                <p className="text-sm font-normal text-slate-700">バイヤーの詳細</p>
                                                <p>名前: {product?.buyerName}</p>
                                                <p>名前: {product?.buyerId}</p>
                                            </div>
                                            <div className="text-sm font-light text-slate-500">
                                                <p className="text-sm font-normal text-slate-700">注文番号</p>
                                                <p>{orderId}</p>

                                      
                                            </div>
                                            <div className="text-sm font-light text-slate-500">

                                                <p className=" text-sm font-normal text-slate-700">日にち</p>
                                                <p>{format(new Date(product?.date), 'yyyy-MM-dd')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-9">
                                    <div className="mx-0 mt-8 flex flex-col">
                                        <table className="min-w-full divide-y divide-slate-500">
                                            <thead>
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-normal text-slate-700 sm:pl-6 md:pl-0"
                                                    >
                                                        商品番号
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="hidden py-3.5 px-3 text-right text-sm font-normal text-slate-700 sm:table-cell"
                                                    >
                                                        製品
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="hidden py-3.5 px-3 text-right text-sm font-normal text-slate-700 sm:table-cell"
                                                    >
                                                        数量
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="py-3.5 pl-3 pr-4 text-right text-sm font-normal text-slate-700 sm:pr-6 md:pr-0"
                                                    >
                                                        価格
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>{rows}</tbody>
                                            <tfoot>
                                                <tr>
                                                    <th
                                                        scope="row"
                                                        colSpan={3}
                                                        className="hidden pt-6 pl-6 pr-3 text-right text-sm font-light text-slate-500 sm:table-cell md:pl-0"
                                                    >
                                                        合計金額
                                                    </th>
                                                    <th
                                                        scope="row"
                                                        className="pt-6 pl-4 pr-3 text-left text-sm font-light text-slate-500 sm:hidden"
                                                    >
                                                        合計金額
                                                    </th>
                                                    <td className="pt-6 pl-3 pr-4 text-right text-sm text-slate-500 sm:pr-6 md:pr-0">
                                                        {product?.totalprice}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th
                                                        scope="row"
                                                        colSpan={3}
                                                        className="hidden pt-6 pl-6 pr-3 text-right text-sm font-light text-slate-500 sm:table-cell md:pl-0"
                                                    >
                                                        全商品
                                                    </th>
                                                    <th
                                                        scope="row"
                                                        className="pt-6 pl-4 pr-3 text-left text-sm font-light text-slate-500 sm:hidden"
                                                    >
                                                        全商品
                                                    </th>
                                                    <td className="pt-6 pl-3 pr-4 text-right text-sm text-slate-500 sm:pr-6 md:pr-0">
                                                        {product?.totalamount}
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>

                                <div className="mt-48 p-9">
                                    <div className="border-t border-slate-200 pt-9">
                                        <div className="text-sm font-light text-slate-700">
                                            <p></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                </section>
            </div>
        </div>
    );
}

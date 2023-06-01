import React, { useEffect, useRef } from 'react';

import $ from 'jquery';
import 'datatables.net-dt/css/jquery.dataTables.min.css';

function ComissionTable({ data }) {
    const initializeDataTable = () => {

        if (typeof window !== 'undefined') {
            require('datatables.net/js/jquery.dataTables.min.js');
            require('datatables.net-dt/css/jquery.dataTables.min.css');
            // new DataTable('#affiliateTable', {}).columns.adjust();
        }
        const table = $('#comissionTable').DataTable({
            //   responsive: true
        });
        table.columns.adjust();
    };
    useEffect(() => {
        initializeDataTable();
    }, []);



    // const tableRef = useRef<any>(null);
    let defaultimg = `https://dyez0ftqpcowi.cloudfront.net/web/assets/slider/37KZ7raEY2_No-Image-Placeholder.svg.png`;




    return (
        <table id="comissionTable" className="display w-full my-6" >
            <thead>
                <tr>
                    {/* {columns?.map((item, index) => (

                        <th key={index}>{item.name}</th>
                    ))} */}
                    <th>Comission</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody >
                {
                    data?.map((item, index) => (
                        <tr key={index} className=' bg-white shadow-lg rounded-lg '>
                            <td>{item?.commissionAmount || 0}</td>
                            {/* <td>{new Date(0, item?.month - 1).toLocaleString('en-US', { month: 'long' })}</td> */}
                            <td>{item?.date}</td>
                        </tr>
                    ))
                }

            </tbody>
        </table>
    );
}

export default ComissionTable;
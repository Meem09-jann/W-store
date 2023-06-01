import React, { useEffect, useRef } from 'react';

import $ from 'jquery';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import DataTable from 'datatables.net-dt';

function RefferalTable({ data }) {

    const initializeDataTable = () => {

        if (typeof window !== 'undefined') {
            require('datatables.net/js/jquery.dataTables.min.js');
            require('datatables.net-dt/css/jquery.dataTables.min.css');
            // new DataTable('#myTable', {}).columns.adjust();
        }
        const table = $('#myTable').DataTable({
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
        <table id="myTable" className="display w-full" >
            <thead>
                <tr>
                    {/* {columns?.map((item, index) => (

                        <th key={index}>{item.name}</th>
                    ))} */}
                    <th>Image</th>
                    <th>Name</th>
                    <th>Contact Number</th>
                </tr>
            </thead>
            <tbody >
                {
                    data?.map((item, index) => (
                        <tr key={index} className=' bg-white shadow-lg rounded-lg '>
                            <td >
                                {item?.photoURL ? (
                                    <img src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}` + item?.photoURL}
                                        alt="avatar"
                                        className="w-16 h-16 rounded-full object-cover z-0 mr-3" />
                                ) : (<img src={defaultimg}
                                    alt="avatar"
                                    className="w-16 h-16 rounded-full object-cover z-0 mr-3" />
                                )}
                            </td>
                            <td>{item.fullname}</td>
                            <td>{item.identifier}</td>
                        </tr>
                    ))
                }

            </tbody>
        </table>
    );
}

export default RefferalTable;
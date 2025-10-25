import React from 'react'

export default function Sorting({sort,handleSort,column,defaultSorting}) {
  return (
    <div onClick={(e)=>{handleSort(e,column)}} className={sort.order === 1 ?"e_none cp assc":sort.order === -1 ?"e_none cp desc":"e_none cp"}>
        {

          defaultSorting?
            <i className=" text-muted fas fa-sort-down"></i>
            :
            sort.column === column?
            
                sort.order === 1 ?
                <i className=" text-muted fas fa-sort-up"></i>
                :
                <i className=" text-muted fas fa-sort-down"></i>

            :
            <i className=" text-muted fas fa-sort"></i>
        }
        
    </div>
  )
}

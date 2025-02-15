/* eslint-disable react/jsx-key */
'use client'
import * as React from 'react';
import { DataGridPremium,   
    GridRowsProp,
    GridRowModesModel,
    // GridRowModes,
    GridColDef,
    // GridToolbarContainer,
    GridActionsCellItem,
    // GridEventListener,
    GridRowId,
    // GridRowModel,
    // GridRowEditStopReasons,
    // GridSlotProps,
    // GridToolbarQuickFilter,
    // GridToolbarFilterButton,
    // GridToolbarColumnsButton, 
  } from '@mui/x-data-grid-premium';
import Box from '@mui/material/Box';
import { TZodCommentSchema } from '@/lib/mongo/schema/CommentSchema';
import { commitUpdate, queryAll } from '@/lib/mongo/actions/CommentActions';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close'
import { Tooltip } from '@mantine/core';
import dayjs from 'dayjs';


declare module '@mui/x-data-grid-premium' {
    interface ToolbarPropsOverrides {
      setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
      ) => void;
    }
  }

  
const CommentManagement=()=>{
  const [rows, setRows] = React.useState<GridRowsProp<(TZodCommentSchema&{_id:string})&{isNew?:boolean|null}>>([]);
    
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

  // const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
  //   if (params.reason === GridRowEditStopReasons.rowFocusOut) {
  //     event.defaultMuiPrevented = true;
  //   }
  // };
  React.useEffect(()=>{async function effectLoadRowsFromDb(){
      await loadRowsFromDb()
  }
  effectLoadRowsFromDb()

  },[])
  const loadRowsFromDb = async ()=>{
    const rowsFromDb:(TZodCommentSchema&{_id:string})[] = (await queryAll() )as unknown as (TZodCommentSchema&{_id:string})[]
    setRows(rowsFromDb)

  }
  
  const setSelected = (id:GridRowId)=>async ()=>{
    const fromRow:(TZodCommentSchema&{_id:string})&{isNew?:boolean|null}|undefined = rows.find(e=>e._id===id)
    if(fromRow===undefined){
      alert("cannot find row id")
      return
    }
    const newRow = {...fromRow, selected:true }
    setRows((oldRows)=>oldRows.map(e=>{
      if(e._id===newRow._id){
        return newRow
      }
      return e
    }))
    await commitUpdate(newRow._id, {...newRow, lastUpdate:dayjs().toDate()})
  }
  const setUnselected = (id:GridRowId)=>async ()=>{
    const fromRow:(TZodCommentSchema&{_id:string})&{isNew?:boolean|null}|undefined = rows.find(e=>e._id===id)
    if(fromRow===undefined){
      alert("cannot find row id")
      return
    }
    const newRow = {...fromRow, selected:false }
    setRows((oldRows)=>oldRows.map(e=>{
      if(e._id===newRow._id){
        return newRow
      }
      return e
    }))
    await commitUpdate(newRow._id, {...newRow, lastUpdate:dayjs().toDate()})
  }

  // const handleDeleteClick = (id: GridRowId) => async () => {
  //   await commitDelete(String(id));
  //   setRows(rows.filter((row) => row.id !== id));
  // };

  // const handleCancelClick = (id: GridRowId) => () => {
  //   setRowModesModel({
  //     ...rowModesModel,
  //     [id]: { mode: GridRowModes.View, ignoreModifications: true },
  //   });

  //   const editedRow = rows.find((row) => row.id === id);
  //   if (editedRow!.isNew) {
  //     setRows(rows.filter((row) => row.id !== id));
  //   }
  // };

  // const processRowUpdate = async (newRow: GridRowModel<(TZodCommentSchema&{_id:string})&{isNew?:boolean|null}>) => {
  //   const updatedRow = { ...newRow, isNew: false };
  //   setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
  //   if(newRow.isNew){
  //     await commitAdd({...newRow, password:encryptData(newRow.password)})
  //   }else{
  //     await commitUpdate({...updatedRow, password:encryptData(updatedRow.password)})
  //   }
  //   return updatedRow;
  // };

  // const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
  //   setRowModesModel(newRowModesModel);
  // };

  const columns: GridColDef[] = [
    { field: '_id', headerName: 'id', width: 180, editable: true },
    {
      field: 'userId',
      headerName: 'userId',
      width: 240,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'comment',
      headerName: 'Comment',
      width: 500,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'lastUpdate',
      headerName: 'lastUpdate',
      width: 120,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'createdAt',
      headerName: 'createdAt',
      width: 120,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'selected',
      headerName: 'selected',
      type: 'boolean',
      width: 100,
      editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 200,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={
            <Tooltip label="select">

              <CheckIcon />

            </Tooltip>
          }
            label="Duplicate"
            className="textPrimary"
            onClick={setSelected(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={
            <Tooltip label="select">
            <CloseIcon />

            </Tooltip>
          }
            label="Edit"
            className="textPrimary"
            onClick={setUnselected(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGridPremium
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        getRowId={(e)=>e._id}
        // onRowModesModelChange={handleRowModesModelChange}
        // processRowUpdate={processRowUpdate}
        slotProps={{
          toolbar: { setRowModesModel },
        }}
      />
    </Box>
  );
}

export default CommentManagement
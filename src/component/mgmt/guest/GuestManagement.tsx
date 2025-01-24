/* eslint-disable react/jsx-key */
'use client'
import * as React from 'react';
import { DataGridPremium,   
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    GridRowEditStopReasons,
    GridSlotProps,
    GridToolbarQuickFilter,
    GridToolbarFilterButton,
    GridToolbarColumnsButton, } from '@mui/x-data-grid-premium';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { TZodUserSchema } from '@/lib/mongo/schema/UserSchema';
import { commitAdd, commitDelete, commitUpdate, queryAll } from '@/lib/mongo/actions/UserActions';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { decryptData, encryptData } from '@/lib/encryption';
import { Tooltip } from '@mantine/core';
import { v4 } from 'uuid';


declare module '@mui/x-data-grid-premium' {
    interface ToolbarPropsOverrides {
      setRows: (newRows: (oldRows: GridRowsProp<TZodUserSchema&{isNew?:boolean|null}>) => GridRowsProp<TZodUserSchema&{isNew?:boolean|null}>) => void;
      setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
      ) => void;
    }
  }

  function EditToolbar(props: GridSlotProps['toolbar']) {
    const { setRows, setRowModesModel } = props;
  
    const handleClick = async () => {
      const id = v4()
      const newRow:TZodUserSchema&{isNew?:boolean|null}={
        id,
        preferredName:"",
        surname:"",
        firstName:"",
        fullChineseName:"",
        phonePrefix:"",
        phoneNumber:"",
        relationship:"",
        email:"",
        side:"BOTH",
        online:false,
        ceremony:false,
        cocktail:false,
        banquet:false,
        remarks:"",
        foodAllergies:"",
        foodChoice:"",
        password:"",
        dinnerDeskNumber:0,
        ceremonySeatNumber:0,
        checkedIn:false,

        isNew:true}
      setRows((oldRows) => [
        ...oldRows,
        newRow,
      ]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'preferredName' },
      }));
    };
  
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add record
        </Button>
        <GridToolbarFilterButton/>
        <GridToolbarColumnsButton/>
        <GridToolbarQuickFilter/>
      </GridToolbarContainer>
    );
  }
const GuestManagement=()=>{
  const [rows, setRows] = React.useState<GridRowsProp<TZodUserSchema&{isNew?:boolean|null}>>([]);
    
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  React.useEffect(()=>{async function effectLoadRowsFromDb(){
      await loadRowsFromDb()
  }
  effectLoadRowsFromDb()

  },[])
  const loadRowsFromDb = async ()=>{
    const rowsFromDb:TZodUserSchema[] = (await queryAll() )as unknown as TZodUserSchema[]
    setRows(rowsFromDb.map(e=>({...e,password:decryptData(e.password)})))

  }
  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    // const row = rows.find(e=>e.id===id)
    // await commitAdd(_.omit(row,"isNew"))
    // await loadRowsFromDb()
    
  };

  const handleDuplicateClick = (id:GridRowId)=>async()=>{
    const fromRow:TZodUserSchema&{isNew?:boolean|null}|undefined = rows.find(e=>e.id===id)
    if(fromRow===undefined){
      alert("cannot find row id")
      return
    }
    
    const newid = v4()
    const newRow:TZodUserSchema&{isNew?:boolean|null}={...fromRow, id:newid, isNew:true}
    setRows((oldRows) => [
      ...oldRows,
      newRow,
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'preferredName' },
    }));
  }

  const handleCheckinClick = (id:GridRowId)=>async ()=>{
    const fromRow:TZodUserSchema&{isNew?:boolean|null}|undefined = rows.find(e=>e.id===id)
    if(fromRow===undefined){
      alert("cannot find row id")
      return
    }
    const newRow = {...fromRow, checkedIn:true }
    setRows((oldRows)=>oldRows.map(e=>{
      if(e.id===newRow.id){
        return newRow
      }
      return e
    }))
    await commitUpdate(newRow)
  }

  const handleDeleteClick = (id: GridRowId) => async () => {
    await commitDelete(String(id));
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow: GridRowModel<TZodUserSchema&{isNew?:boolean|null}>) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    if(newRow.isNew){
      await commitAdd({...newRow, password:encryptData(newRow.password)})
    }else{
      await commitUpdate({...updatedRow, password:encryptData(updatedRow.password)})
    }
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'id', width: 180, editable: true },
    {
      field: 'email',
      headerName: 'email',
      width: 240,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'preferredName',
      headerName: 'preferredName',
      width: 120,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'surname',
      headerName: 'surname',
      width: 120,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'firstName',
      headerName: 'firstName',
      width: 120,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'fullChineseName',
      headerName: 'fullChineseName',
      width: 120,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'phonePrefix',
      headerName: 'phonePrefix',
      width: 120,
      align: 'left',
      headerAlign: 'left',
      type: 'singleSelect',
      valueOptions: ["+852","+1","+86","+44","+61",""],
      editable: true,
    },
    {
      field: 'phoneNumber',
      headerName: 'phoneNumber',
      width: 120,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'relationship',
      headerName: 'relationship',
      width: 220,
      editable: true,
    },
    {
      field: 'side',
      headerName: 'side',
      width: 120,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['GROOM', 'BRIDE', 'BOTH'],
    },
    {
      field: 'online',
      headerName: 'online',
      type: 'boolean',
      width: 100,
      editable: true,
    },
    {
      field: 'ceremony',
      headerName: 'ceremony',
      type: 'boolean',
      width: 80,
      editable: true,
    },
    {
      field: 'cocktail',
      headerName: 'cocktail',
      type: 'boolean',
      width: 80,
      editable: true,
    },
    {
      field: 'banquet',
      headerName: 'banquet',
      type: 'boolean',
      width: 80,
      editable: true,
    },
    {
      field: 'remarks',
      headerName: 'remarks',
      width: 220,
      editable: true,
    },
    {
      field: 'foodAllergies',
      headerName: 'foodAllergies',
      width: 220,
      editable: true,
    },
    {
      field: 'foodChoice',
      headerName: 'foodChoice',
      width: 220,
      editable: true,
      type: 'singleSelect',
      valueOptions: ["beef","fish&shrimp","vegetarian"],
    },
    {
      field: 'password',
      headerName: 'password',
      width: 120,
      editable: true,
    },
    {
      field: 'dinnerDeskNumber',
      headerName: 'dinnerDeskNumber',
      type:"number",
      width: 80,
      editable: true,
    },
    {
      field: 'ceremonySeatNumber',
      headerName: 'ceremonySeatNumber',
      type:"number",
      width: 80,
      editable: true,
    },
    {
      field: 'checkedIn',
      headerName: 'checkedIn',
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
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={
              <Tooltip label="save">
                <SaveIcon />
              </Tooltip>
              }
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={
                <Tooltip label="cancel">
              <CancelIcon />
              </Tooltip>}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={
            <Tooltip label="dubplicate record">

            <ContentCopyIcon />
            </Tooltip>
          }
            label="Duplicate"
            className="textPrimary"
            onClick={handleDuplicateClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={
            <Tooltip label="checkin">

            <CheckIcon />
            </Tooltip>
          }
            label="Edit"
            className="textPrimary"
            onClick={handleCheckinClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={
            <Tooltip label="Edit">

            <EditIcon />
            </Tooltip>
          }
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={
            <Tooltip label="Delete">

              <DeleteIcon />
            </Tooltip>
          }
            label="Delete"
            onClick={handleDeleteClick(id)}
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
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{ toolbar: EditToolbar }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
    </Box>
  );
}

export default GuestManagement
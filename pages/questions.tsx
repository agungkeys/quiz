'use client'

import React, { ChangeEvent, useEffect, useState } from 'react';
import Layout from '@/components/layout';
import * as XLSX from 'xlsx';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineRefresh,
  HiOutlineCheckCircle,
  HiOutlinePlus,
  HiOutlineSave,
} from "react-icons/hi";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';

interface QuestionsProps {
  // Add your prop types here
}

interface IQuestions {
  id?: number;
  question?: string;
  answer?: string;
  status?: boolean;
}

interface ExcelData {
  [key: string]: any; // Adjust this according to your Excel structure
}

const initForm = {
  id: 0,
  answer: '',
  question: '',
  status: false,
}

const Questions: React.FC<QuestionsProps> = () => {
  const { toast } = useToast()
  const [listQuestion, setListQuestion] = useState<IQuestions[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [question, setQuestion] = useState<IQuestions>();
  const [formData, setFormData] = useState<IQuestions>(initForm);
  const [mode, setMode] = useState<string>('question');
  const [isLoadingUpload, setLoadingUpload] = useState<boolean>(false);

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const list = localStorage.getItem('questions') || ''
    setListQuestion(list ? JSON.parse(list) : [])
  }

  const handleResetStatus = () => {
    const newArray:IQuestions[] = listQuestion.map(item => ({
      ...item,
      status: false,
    }));
    localStorage.setItem('questions', JSON.stringify(newArray));
    toast({
      title: "Success",
      description: "All status has been reset",
      variant: "success"
    })
    loadData()
  }

  const handleOpenDialog = (mode?:string, data:IQuestions | null = null) => {
    setMode(mode || '');
    setOpenDialog(true);
    if(data){
      setQuestion(data);
      setFormData(data)
    }else{
      setQuestion({})
      setFormData(initForm);
    }

  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStatusChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      status: !prevData.status,
    }));
  };

  const handleSaveData = (data:IQuestions | null = null) => {
    if(data?.id){
    }else{
      const id = listQuestion.length
      const data = {
        ...formData,
        id: id + 1
      }
      const tempData = [
        ...listQuestion,
        data
      ]
      localStorage.setItem('questions', JSON.stringify(tempData));
      toast({
        title: "Success",
        description: "Data has been saved",
        variant: "success"
      })
      setFormData(initForm);
      setOpenDialog(false);
      loadData();
    }
  }

  const handleUpdateData = () => {
    const tempData = listQuestion.map(item => {
      if (item.id === formData.id) {
        return { 
          ...item, 
          answer: formData.answer,
          question: formData.question, 
          status: formData.status
        };
      }
      return item;
    });
    localStorage.setItem('questions', JSON.stringify(tempData));
      toast({
        title: "Success",
        description: "Data has been updated",
        variant: "success"
      })
      setFormData(initForm);
      setOpenDialog(false);
      loadData();
  }

  const handleDeleteData = (id?:number) => {
    const tempData = listQuestion.filter(item => item.id !== id);
    localStorage.setItem('questions', JSON.stringify(tempData));
    toast({
      title: "Success",
      description: "Data has been deleted",
      variant: "success"
    });
    loadData();
  }

  const handleDeleteAllData = () => {
    localStorage.removeItem('questions');
    setOpenDialog(false);
    loadData();
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setLoadingUpload(true);
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData: ExcelData[] = XLSX.utils.sheet_to_json(sheet);
      if(jsonData.length > 0) {
        setLoadingUpload(false);
        setOpenDialog(false);
        localStorage.setItem('questions', JSON.stringify(jsonData));
        loadData();
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleViewMode = () => {
   switch (mode) {
    case 'import':
      return (<DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Data Question</DialogTitle>
        </DialogHeader>
          {isLoadingUpload ?
            <div className='flex items-center gap-2'>
              <Loader2 className="h-6 w-6 animate-spin text-blue-700" /> 
              <span className='text-gray-700'>Process to upload...</span>
            </div>
          :
            <Input type="file" onChange={handleFileUpload} />
          }
        {/* <DialogFooter className="sm:justify-start">
          <Button>Save</Button>
        </DialogFooter> */}
      </DialogContent>);
      break;
    case 'destroy':
      return (<DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Delete All Data</DialogTitle>
        </DialogHeader>
        <Button variant={`destructive`} className='gap-2' onClick={handleDeleteAllData}>
          <HiOutlineTrash size={15} />
          Delete All Data
        </Button>
      </DialogContent>);
      break;
   
    default:
      return (<DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{question?.id ? 'Edit Data Question' : 'Add Data Question'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="question" className="text-right text-md">
              Question
            </Label>
            <Textarea 
              name='question'
              className='col-span-3 w-full h-10 text-md' 
              placeholder='Masukkan soal'
              value={formData.question}
              onChange={handleInputChange}
            />
            {/* <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            /> */}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="answer" className="text-right text-md">
              Answer
            </Label>
            <Textarea 
              name='answer'
              className='col-span-3 w-full h-10 text-md' 
              placeholder='Masukkan jawaban'
              value={formData.answer}
              onChange={handleInputChange}
            />
            {/* <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            /> */}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right text-md">
              Status
            </Label>
            <Switch 
              name="status" 
              checked={formData.status}
              onCheckedChange={handleStatusChange}
            />
            {/* <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            /> */}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={question?.id ? () => handleUpdateData() : () => handleSaveData(question)}>Save</Button>
        </DialogFooter>
      </DialogContent>);
      break;
   }
  }
  
  return (
    <Layout title="Questions">
      <div className='max-w-screen-xl mx-auto px-4'>
        <div className='pt-8'>
          <div className='flex items-center'>
            <h1 className='font-semibold text-xl'>List Questions ({listQuestion.length} Data)</h1>
            <div className='ml-auto flex'>
              <div className='ml-auto flex gap-3'>
                <Button variant={`destructive`} className='gap-2' onClick={() => handleOpenDialog('destroy')}>
                  <HiOutlineTrash size={15} />
                  Delete All Data
                </Button>
                <Button onClick={handleResetStatus} variant={`outline`} className='gap-2'>
                  <HiOutlineRefresh size={15} />
                  Reset Status
                </Button>
                <Button className='gap-2' onClick={() => handleOpenDialog()}>
                  <HiOutlinePlus size={15} />
                  Add Data
                </Button>
                <Button variant={`outline`} className='gap-2' onClick={() => handleOpenDialog('import')}>
                  <HiOutlineSave size={15} />
                  Import Data
                </Button>
              </div>
            </div>
          </div>
          <Table className='mt-4 border-2 rounded-lg'>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20px]">ID</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Answer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listQuestion.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.question}</TableCell>
                  <TableCell>{item.answer}</TableCell>
                  <TableCell>{item.status ? <span className='text-green-500'>
                    <HiOutlineCheckCircle size={28} />
                  </span> : ''}</TableCell>
                  <TableCell className="text-right">
                    <div className='flex gap-2'>
                      <Button onClick={() => handleOpenDialog('edit', item)}>
                        <HiOutlinePencil size={15} />
                      </Button>
                      <Button onClick={() => handleDeleteData(item.id)} variant={`destructive`}>
                        <HiOutlineTrash size={15} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        {handleViewMode()}
      </Dialog>
    </Layout>
  );
};

export default Questions;
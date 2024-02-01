'use client'

import React, { ChangeEvent, useEffect, useState } from 'react';
import Layout from '@/components/layout';
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
  HiOutlinePlus
} from "react-icons/hi";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface QuestionsProps {
  // Add your prop types here
}

interface IQuestions {
  id?: number;
  question?: string;
  answer?: string;
  status?: boolean;
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

  const handleOpenDialog = (data:IQuestions | null = null) => {
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
  
  return (
    <Layout title="Questions">
      <div className='max-w-screen-xl mx-auto px-4'>
        <div className='pt-8'>
          <div className='flex items-center'>
            <h1 className='font-semibold text-xl'>List Questions ({listQuestion.length} Data)</h1>
            <div className='ml-auto flex'>
              <div className='ml-auto flex gap-3'>
                <Button onClick={handleResetStatus} variant={`outline`} className='gap-2'>
                  <HiOutlineRefresh size={15} />
                  Reset Status
                </Button>
                <Button className='gap-2' onClick={() => handleOpenDialog()}>
                  <HiOutlinePlus size={15} />
                  Add Data
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
                      <Button onClick={() => handleOpenDialog(item)}>
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
        <DialogContent className="max-w-lg">
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
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Questions;
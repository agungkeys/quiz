'use client'

import React, { useEffect, useState } from 'react';
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

const Questions: React.FC<QuestionsProps> = () => {
  const { toast } = useToast()
  const [listQuestion, setListQuestion] = useState<IQuestions[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [question, setQuestion] = useState<IQuestions>();

  useEffect(() => {
    const list = localStorage.getItem('questions') || ''
    setListQuestion(list ? JSON.parse(list) : [])
  }, [])

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
    const list = localStorage.getItem('questions') || ''
    setListQuestion(list ? JSON.parse(list) : [])
  }

  const handleOpenDialog = (data:IQuestions | null = null) => {
    console.log("🚀 ~ handleOpenDialog ~ data:", data)
    setOpenDialog(true);
    if(data){
      setQuestion(data);
    }else{
      setQuestion({})
    }

  }

  const handleAddData = () => {

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
                      <Button variant={`destructive`}>
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
                id='question'
                className='col-span-3 w-full h-10 text-md' 
                placeholder='Masukkan soal'
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
                id='answer'
                className='col-span-3 w-full h-10 text-md' 
                placeholder='Masukkan jawaban'
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
              <Switch id="status" />
              {/* <Input
                id="username"
                defaultValue="@peduarte"
                className="col-span-3"
              /> */}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Questions;
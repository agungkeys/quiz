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

import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";

interface QuestionsProps {
  // Add your prop types here
}

interface IQuestions {
  id: number;
  question?: string;
  answer?: string;
  status?: boolean;
}

const Questions: React.FC<QuestionsProps> = () => {
  const [listQuestion, setListQuestion] = useState<IQuestions[]>([]);

  useEffect(() => {
    const list = localStorage.getItem('questions') || ''
    setListQuestion(JSON.parse(list))
  }, [])
  
  return (
    <Layout title="Questions">
      <div className='max-w-screen-lg mx-auto px-4'>
        <div className='pt-8'>
          <h1>List Questions ({listQuestion.length} Data)</h1>
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
                  <TableCell>{item.status ? `Done` : `-`}</TableCell>
                  <TableCell className="text-right">
                    <div className='flex gap-2'>
                      <Button>
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
    </Layout>
  );
};

export default Questions;
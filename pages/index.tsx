'use client'

import React, { useEffect, useState, useRef } from 'react';
import Layout from '@/components/layout';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  HiXCircle, 
  HiOutlineTrash, 
  HiOutlineServer, 
  HiOutlineThumbUp, 
  HiOutlineX,
  HiOutlineSparkles,
  HiMinusCircle,
} from "react-icons/hi";

interface HomeProps {
  // Add your prop types here
}

interface IQuestions {
  id: number;
  question?: string;
  answer?: string;
  gift?: string;
  status?: boolean;
}

const Home: React.FC<HomeProps> = () => {
  const audioWrongRef = useRef<HTMLAudioElement>(null);
  const audioRightRef = useRef<HTMLAudioElement>(null);
  const audioRouletteRef = useRef<HTMLAudioElement>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<IQuestions>({id: 0, question: '', answer: '', gift: '', status: false});
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  // const [usedQuestions, setUsedQuestions] = useState<IQuestions[]>([]);
  const [isShowAnswer, setIsShowAnswer] = useState<boolean>(false);
  const [isBlinkingWrong, setIsBlinkingWrong] = useState<boolean>(false);
  const [listQuestion, setListQuestion] = useState<IQuestions[]>([]);
  const [isShowLabel, setShowLabel] = useState<boolean>(false);
  const [valueGift, setGift] = useState<string>('');
  const [winner1, setWinner1] = useState<IQuestions[]>([]);
  const [winner2, setWinner2] = useState<IQuestions[]>([]);
  const [winner3, setWinner3] = useState<IQuestions[]>([]);

  useEffect(() => {
    const dataLocal = localStorage.getItem('questions') || '';
    const data = dataLocal ? JSON.parse(dataLocal) : [];
    setListQuestion(data);
    loadDataWinner();
  }, [])
  

  useEffect(() => {
    let blinkInterval: NodeJS.Timeout;

    if (isBlinkingWrong) {
      blinkInterval = setInterval(() => {
        setIsBlinkingWrong((prevIsBlinking) => !prevIsBlinking);
      }, 1000);
    }

    return () => clearInterval(blinkInterval);
  }, [isBlinkingWrong]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAnimating) {
      interval = setInterval(() => {
        const availableQuestions = listQuestion?.filter((item:IQuestions) => item.status === false) || [];

        if (availableQuestions.length < 0) {
          setIsAnimating(false);
          clearInterval(interval);
        } else {
          const randomIndex = Math.floor(
            Math.random() * availableQuestions.length
          );
          const newQuestion = availableQuestions[randomIndex];
          setCurrentQuestion(newQuestion);
        }
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isAnimating, listQuestion]);

  const handleStartAnimation = () => {
    setIsAnimating(true);
    setIsShowAnswer(false);
    setIsReady(true);
    if (audioRouletteRef.current) {
      audioRouletteRef.current.play();
    }
  };

  const handleStopAnimation = () => {
    setIsAnimating(false);
    if (audioRouletteRef.current) {
      audioRouletteRef.current.pause();
      audioRouletteRef.current.currentTime = 0;
    }
  };

  const handleShowAnswer = () => {
    setIsShowAnswer(!isShowAnswer)
  }

  const handleSetQuestion = () => {
    const indexToUpdate = listQuestion.findIndex((item: { id: number }) => item.id === currentQuestion?.id);

    if (indexToUpdate !== -1) {
      listQuestion[indexToUpdate] = {
        ...listQuestion[indexToUpdate],
        status: true,
        gift: valueGift,
      };

      localStorage.setItem('questions', JSON.stringify(listQuestion));
    }
    setGift('');
  };

  const handleAnswerTrue = () => {
    setIsShowAnswer(true);
    // confetti({
    //   particleCount: 300,
    //   spread: 220,
    //   origin: { y: 0.6 }
    // });
    if (audioRightRef.current) {
      audioRightRef.current.play();
    }
    handleSetQuestion();
    loadDataWinner();
  }

  const handleAnswerFalse = () => {
    setIsBlinkingWrong(true);
    if (audioWrongRef.current) {
      audioWrongRef.current.play();
    }
  }

  // const handleAnswerToLocalStorage = () => {
  //   const data = JSON.stringify(questions);
  //   localStorage.setItem('questions', data)
  // }

  const handleClear = () => {
    setIsShowAnswer(false);
    setIsReady(false);
  }

  const handleClickLabel = () => {
    setShowLabel(!isShowLabel);
  }

  const handleSelectGift = (e: React.SetStateAction<string>) => {
    setGift(e)
  }

  const loadDataWinner = () => {
    const data = localStorage.getItem('questions') || '';
    let dataWinner1: IQuestions[] = data ? JSON.parse(data).filter((dt:IQuestions) => dt.gift === 'voucher1') : [];
    setWinner1(dataWinner1);
    let dataWinner2: IQuestions[] = data ? JSON.parse(data).filter((dt:IQuestions) => dt.gift === 'voucher2'): [];
    setWinner2(dataWinner2);
    let dataWinner3: IQuestions[] = data ? JSON.parse(data).filter((dt:IQuestions) => dt.gift === 'grandprize') : [];
    setWinner3(dataWinner3);
  }



  return (
    <Layout title="Home">
      <div className='max-w-screen-2xl mx-auto'>
        {/* <h1 className='p-4 pt-12 text-4xl font-bold text-center'>Babak Ke-1</h1> */}
        <div className='pt-4 pb-4'>
          <div className='mt-1'>
            <div className='rounded-2xl border-4 border-gray-300 h-[14em] py-[2em] mx-[4em] items-center'>
              <div className='flex justify-center items-center gap-2 pb-2'>
                {isShowLabel &&
                  <h1 className='text-2xl font-semibold text-blue-700 text-center'>
                    Question 
                  </h1>
                || null}
                {/* {isAnimating &&
                  <Loader2 className="h-6 w-6 animate-spin text-blue-700" />
                || null } */}
              </div>
              <div className='text-center'>
                {isReady && 
                  <span className='text-6xl font-bold'>{currentQuestion?.question || 'Not Found'}</span>
                || null}
              </div>
              <div className='text-center mt-5'>
                {isReady && 
                  <span className='text-5xl tracking-wider'>{currentQuestion?.answer || 'Import your data'}</span>
                || null}
              </div>
            </div>
          </div>
          {/* <div className='mt-8'>
            <div className={`${isBlinkingWrong ? 'bg-red-200' : 'bg-blue-100'} rounded-2xl p-4 h-[13em]`}>
            {isShowLabel &&
              <h1 className='text-2xl font-semibold text-blue-700 pb-2 text-center'>Answer</h1>
            || null}
              {isShowAnswer && 
                <div className='text-center'>
                  <span className='text-3xl font-semibold'>{currentQuestion.answer}</span>
                </div>
              || null}
              {isBlinkingWrong ?
                <div className='text-center pt-3 text-red-700'>
                  <div className='flex justify-center'>
                    <HiXCircle size={100} className='' />
                  </div>
                </div>
              : null}
            </div>
          </div> */}

          <div className='flex ml-auto gap-8'>
            {/* <div className='w-full bg-green-200 p-3 rounded-lg'>
              <h3 className='text-green-700'>Answer:</h3>
              {isReady &&
                <span>{currentQuestion?.answer || '-'}</span>
              || null}
            </div> */}
            <div className='w-full ml-auto'>
              <div className='flex py-3 gap-6'>
                {/* <Button onClick={handleAnswerToLocalStorage} className='text-xl'>Set Question</Button> */}
                <Link href='/questions'>
                  <Button className='ml-[10em] text-xl flex gap-1' variant={`outline`} size={`sm`}>
                    <HiOutlineServer size={20} className='' />
                    All Data
                  </Button>
                </Link>
                <Button onClick={handleClear} className='mr-[5em] text-xl flex gap-1' size={`sm`}>
                  <HiOutlineTrash size={20} />
                  Clear
                </Button>
                <Button disabled={isAnimating} onClick={handleStartAnimation} className='text-xl flex gap-1' variant={`success`} size={`sm`}>
                  {isAnimating &&
                    <Loader2 className="h-6 w-6 animate-spin" />
                  || 
                    <HiOutlineSparkles size={20} className='' />
                  }
                  Acak
                </Button>
                <audio ref={audioRouletteRef} src="/roulete.mp3" />
                <Button disabled={!isAnimating} onClick={handleStopAnimation} variant={`destructive`} className='text-xl flex gap-1' size={`sm`}>
                  <HiMinusCircle size={20} className='' />
                  Stop
                </Button>
                <div className='ml-4 mw-[2em]'>
                  <Select onValueChange={handleSelectGift} value={valueGift}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gift" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="voucher1">Voucher 1</SelectItem>
                      <SelectItem value="voucher2">Voucher 2</SelectItem>
                      <SelectItem value="grandprize">Grand Prize</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button disabled={isAnimating} onClick={handleAnswerTrue} variant={`success`} className='text-xl flex gap-1' size={`sm`}>
                  <HiOutlineThumbUp size={20} />
                  WINS
                </Button>
                <audio ref={audioRightRef} src="/right.mp3" />
                {/* <Button disabled={isAnimating} onClick={handleAnswerFalse} className='text-xl flex gap-1' variant={`destructive`}>
                  <HiOutlineX size={20} className='' />
                  Salah
                </Button>
                <audio ref={audioWrongRef} src="/wrong.mp3" /> */}
              </div>
              <div className='flex justify-end mt-2 gap-2'>
                {/* <Button onClick={handleClear} className='text-xl flex gap-1'>
                  <HiOutlineTrash size={20} />
                  Clear
                </Button> */}
                {/* <Button className='text-xl' variant={`secondary`} size={`sm`} onClick={handleClickLabel}>
                  {isShowLabel && `Hide` || `Show`} Label
                </Button> */}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-3 gap-4'>
            <div className='rounded-xl border-2 border-gray-100 p-4'>
              <h1 className='mb-3'>10 Pemenang Voucher MAP I</h1>
              <div className='grid grid-cols-2 gap-2'>
                {winner1.map(item => 
                  <div key={item.id} className='bg-yellow-100 rounded-xl p-2'>
                    <span>{item?.question || '-'}</span>
                    <div>
                      <span className='font-bold'>{item?.answer || '-'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className='rounded-xl border-2 border-gray-100 p-4'>
              <h1>10 Pemenang Voucher MAP 2</h1>
              <div className='grid grid-cols-2 gap-2'>
                {winner2.map(item => 
                  <div key={item.id} className='bg-green-100 rounded-xl p-2'>
                    <span>{item?.question || '-'}</span>
                    <div>
                      <span className='font-bold'>{item?.answer || '-'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className='rounded-xl border-2 border-gray-100 p-4'>
              <h1>5 Pemenang Grand Prize</h1>
              <div className='grid grid-cols-2 gap-2'>
                {winner3.map(item => 
                  <div key={item.id} className='bg-blue-100 rounded-xl p-2'>
                    <span>{item?.question || '-'}</span>
                    <div>
                      <span className='font-bold'>{item?.answer || '-'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
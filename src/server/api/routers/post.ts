import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAllTexts:publicProcedure.query(()=>{
    return db.post.findMany();
  }),

  postTexts:publicProcedure.input(
    z.object({title: z.string(), description: z.string()}),
  ).mutation((req)=>{
    const postText = db.post.create({
      data: {
        title: req.input.title,
        description:req.input.description,
      },
    });
    return postText
  }),

  getDetailText:publicProcedure.input(z.object({id: z.number()})).query((req)=>{
    return db.post.findUnique({where:{id:req.input.id}});
  }),

  deleteText:publicProcedure.input(z.object({id: z.number()})).mutation((req)=>{
    return db.post.delete({where:{id:req.input.id}});
  }),

  editText: publicProcedure
  .input(z.object({
    id: z.number(),
    title: z.string().min(1),
    description: z.string().nullable(),
  }))
  .mutation((req) => {
    return db.post.update({
      where: { id: req.input.id },
      data: {
        title: req.input.title,
        description: req.input.description,
      },
    });
  }),


  

});

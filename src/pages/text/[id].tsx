//詳細ページ
import { useRouter } from 'next/router';
import React from 'react'
import { api } from '~/utils/api'
import  { useRef } from 'react'

const DtailPage = () => {
    const router = useRouter();
    const {id} = router.query;
    const parseNumberId = id ? Number(id):NaN;

    const allTexts = api.post.getAllTexts.useQuery();
    const detailText = api.post.getDetailText.useQuery({id:parseNumberId});
    const deleteText = api.post.deleteText.useMutation({
        onSuccess: () => {
    allTexts.refetch();
    router.push("/");  // 成功したときだけリダイレクト
    },
    onError: (error) => {
      console.error("編集に失敗しました:", error);
      alert("編集に失敗しました。");
    }
    });

    const editText = api.post.editText.useMutation({
        onSettled: ()=> {
            allTexts.refetch();
        }
    });

    console.log(detailText.data);

    const handleDelete = () => {
        if (window.confirm("本当に削除しますか？")){
            try {
                deleteText.mutate({id:parseNumberId});
                router.push("/");
            } catch (err) {
                console.log(err);
            }
        }
    }

    const titleRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);

    
    const handleEdit = () => {
    if (window.confirm("本当に編集を確定しますか？")) {
        try {
        editText.mutate({
            id: parseNumberId,  // 編集対象のID（URLから取得など）
            title: titleRef.current?.value ?? "",  // 空文字 fallback
            description: descriptionRef.current?.value ?? null, // 任意なら null にする
        });
        router.push("/");
        } catch (err) {
        console.error(err);
        }
    }
    };
    

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#3a3a3a] to-[#000000]">
      <div className="mx-auto mt-10 w-full max-w-2xl rounded-md bg-white p-6 shadow-md">
        <h1 className="mb-4 text-3xl font-bold">{detailText.data?.title}</h1>
        <div className="mb-8 text-sm text-gray-500">
          <span>{detailText.data?.createdAt.toLocaleDateString()}</span>{" "}
          {/* Created Atが必要ならば、表示 */}
        </div>
        <input
            ref={titleRef}
            type="text"
            defaultValue={detailText.data?.title}
            className="mb-4 w-full rounded-md border px-4 py-2"
            />
            <textarea
            ref={descriptionRef}
            defaultValue={detailText.data?.description ?? ""}
            className="mb-4 w-full rounded-md border px-4 py-2"
            />
        <div className="flex space-x-4 mt-4">
        <button
          className="mt-4 rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 transition"
          onClick={handleEdit}
        >
          Edit
        </button>
        <button
          className="mt-4 rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition"
          onClick={handleDelete}
        >
          Delete
        </button>
        </div>
      </div>
    </main>
  );
};

export default DtailPage
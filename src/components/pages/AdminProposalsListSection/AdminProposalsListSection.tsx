"use client";

import { DangerButton } from "@/components/common/Buttons";
import { DataTable } from "@/components/common/DataTable";
import { DataTableData } from "@/components/common/DataTable/elements/DataTableData";
import { DataTableRow } from "@/components/common/DataTable/elements/DataTableRow";
import { PROPOSALS_TABLE_HEADERS } from "@/constants/DataTableHeaders";
import { Button, Checkbox, Group, Stack } from "@mantine/core";
import { useProposals } from "@/hooks/swr/useProposals";
import { ChangeEvent, useState } from "react";
import { useTableSort } from "@/hooks/useTableSort";
import { PAGE_SIZES } from "@/constants/PageSize";
import { CommonAxios } from "@/utils/CommonAxios";
import { SearchInput } from "@/components/common/SearchInput";
import { handleChangeSearch } from "@/utils/handleChangeSearch";
import { useDebouncedState } from "@mantine/hooks";
import { ProposalsRequestParams } from "@/types/proposals";
import { useRouter } from "next/navigation";

export default function AdminProposalListSection() {
  const { push } = useRouter();

  /* 페이지당 행 개수 */
  const [pageSize, setPageSize] = useState<string | null>(String(PAGE_SIZES[0]));
  /* 페이지네이션 페이지 넘버*/
  const [pageNumber, setPageNumber] = useState(1);
  /* 데이터 정렬 훅 */
  const { sortBy, order, handleSortButton } = useTableSort();

  /* 쿼리 debounced state, 검색창에 이용 */
  const [query, setQuery] = useDebouncedState<ProposalsRequestParams>(
    {
      page: pageNumber - 1,
      size: Number(pageSize),
    },
    300
  );

  /* SWR 훅을 사용하여 공지사항 목록 패칭 */
  // TODO: 백엔드 수정 이후 sort 파라미터 추가
  const { data, pageData, mutate } = useProposals({
    params: { ...query, page: pageNumber - 1, size: Number(pageSize) },
  });

  /* 체크박스 전체선택, 일괄선택 다루는 파트 */
  const [selectedProposal, setSelectedProposal] = useState<number[]>([]);
  const allChecked = selectedProposal.length === data?.length;
  const indeterminate = selectedProposal.length > 0 && !allChecked;
  // 전체선택 함수
  const handleSelectAll = () => {
    if (data) {
      if (allChecked) {
        setSelectedProposal([]);
      } else {
        setSelectedProposal(data.map((application) => application.id));
      }
    }
  };
  // 개별선택 함수
  const handleSelect = (id: number) => {
    setSelectedProposal((prev) =>
      prev.includes(id) ? prev.filter((applicationId) => applicationId !== id) : [...prev, id]
    );
  };

  /* 삭제 버튼 핸들러 */
  const handleDelete = () => {
    // TODO: 삭제 확인하는 모달 추가
    Promise.all(selectedProposal.map((id) => CommonAxios.delete(`/Proposal/${id}`))).then(() => {
      setSelectedProposal([]);
      mutate();
    });
  };

  /* 검색창 핸들러 */
  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleChangeSearch<string, ProposalsRequestParams>({
      name: "title",
      value: event.target.value,
      setQuery,
    });
    setPageNumber(1);
  };

  return (
    <>
      <Stack>
        <Group justify="flex-end">
          <SearchInput placeholder="제목 입력" w={300} onChange={onSearchChange} />
        </Group>
        <Group justify="flex-start">
          <DangerButton onClick={handleDelete}>선택 삭제</DangerButton>
        </Group>
        <DataTable
          headers={PROPOSALS_TABLE_HEADERS}
          sortBy={sortBy}
          order={order}
          handleSortButton={handleSortButton}
          totalElements={String(pageData?.totalElements)}
          pageSize={pageSize}
          setPageSize={setPageSize}
          totalPages={pageData?.totalPages}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          withCheckbox
          checkboxProps={{ checked: allChecked, indeterminate, onChange: handleSelectAll }}
        >
          {data?.map((inquiry, index) => (
            <DataTableRow key={index}>
              <DataTableData text={false}>
                <Checkbox
                  checked={selectedProposal.includes(inquiry.id)}
                  onChange={() => handleSelect(inquiry.id)}
                />
              </DataTableData>
              <DataTableData>{index + 1 + (pageNumber - 1) * Number(pageSize)}</DataTableData>
              <DataTableData>{inquiry.title}</DataTableData>
              <DataTableData>{inquiry.name}</DataTableData>
              <DataTableData>{inquiry.createdDate}</DataTableData>
              <DataTableData text={false}>
                <Button
                  onClick={() => {
                    push(`Proposal/${inquiry.id}`);
                  }}
                >
                  수정
                </Button>
              </DataTableData>
            </DataTableRow>
          ))}
        </DataTable>
      </Stack>
    </>
  );
}
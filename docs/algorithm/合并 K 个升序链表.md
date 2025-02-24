---
title: 合并 K 个升序链表
createTime: 2025/02/24 19:58:31
permalink: /article/hr9kjw32/
tags:
  - 堆
  - 分治
  - 后序
  - 动态规划
---
## [23. 合并 K 个升序链表](https://leetcode.cn/problems/merge-k-sorted-lists/)

给你一个链表数组，每个链表都已经按升序排列。

请你将所有链表合并到一个升序链表中，返回合并后的链表。

**示例 1：**

```
输入：lists = [[1,4,5],[1,3,4],[2,6]]
输出：[1,1,2,3,4,4,5,6]
解释：链表数组如下：
[
  1->4->5,
  1->3->4,
  2->6
]
将它们合并到一个有序链表中得到。
1->1->2->3->4->4->5->6
```

**示例 2：**

```
输入：lists = []
输出：[]
```

**示例 3：**

```
输入：lists = [[]]
输出：[]
```

**提示：**

- `k == lists.length`
- `0 <= k <= 10^4`
- `0 <= lists[i].length <= 500`
- `-10^4 <= lists[i][j] <= 10^4`
- `lists[i]` 按 **升序** 排列
- `lists[i].length` 的总和不超过 `10^4`

分治合并的时间复杂度比挨个合并的时间复杂度低，这个很有启示意义。

## 小顶堆

先把所有链表的头节点加入小顶堆，然后弹出堆顶元素，弹出后要检查堆顶元素是否在原链表中有后继节点，如果有，则加入后继节点。

```java
class Solution {
    ListNode mergeKLists(ListNode[] lists) {
        if (lists.length == 0)
            return null;
        
        // 优先级队列，最小堆。注意初始化优先级队列时可以指定长度。
        Queue<ListNode> pq = new PriorityQueue<>(lists.length, (a, b) -> (a.val - b.val));
        // 将 k 个链表的头节点加入最小堆
        for (ListNode head : lists) {
            if (head != null) {
                pq.add(head);
            }
        }

        // 虚拟头节点
        ListNode dummy = new ListNode(-1);
        // 构建节点，不断前进
        ListNode p = dummy;
        
        // 这个方法的时间复杂度是O(n logk)，n是所有节点，k是链表条数。
        // 每次从优先队列中取出最小元素的时间复杂度是 O(log k)，插入操作的时间复杂度也是 O(log k)。
        while (!pq.isEmpty()) {
            // 获取最小节点，接到结果链表中
            ListNode node = pq.poll();
            p.next = node;
            
            if (node.next != null) {
                pq.add(node.next);
            }
            
            // 注意，p 指针要前进
            p = p.next;
        }
        
        return dummy.next;
    }
}
```

- 时间复杂度：$O(n \log k)$，n 是节点的个数，k 是链表的条数。
- 空间复杂度：O(k)

## 分治，后序，动态规划

利用升序合并两个链表，后序操作，动态规划

```java
class Solution {
    // 合并 k 个有序链表
    public ListNode mergeKLists(ListNode[] lists) {
        // 如果输入数组为空或长度为 0，则返回 null
        if (lists == null || lists.length == 0) {
            return null;
        }
        
        // 调用递归方法 merge 对数组中的链表进行两两合并
        return merge(lists, 0, lists.length - 1);
    }
    
    // 合并 k 个有序链表，返回合并后的链表的头节点
    private ListNode merge(ListNode[] lists, int left, int right) {
        // 结束条件：如果左右指针相等，说明只有一个链表，直接返回该链表
        if (left == right) return lists[left];
        
        // 计算中间位置
        int mid = (left + right) >> 1;
        // 递归合并左右两个子区间的链表
        ListNode leftList = merge(lists, left, mid);
        ListNode rightList = merge(lists, mid + 1, right);
        
        // 合并两个链表
        return mergeTwoLists(leftList, rightList);
    }
    
    // 递归合并两个有序链表，返回合并后的链表的头节点
    private ListNode mergeTwoLists(ListNode left, ListNode right) {
        // 如果其中一个链表为空，直接返回另一个链表。判空是为了防止空指针异常。
        if (left == null) return right;
        if (right == null) return left;
        
        // 比较两个链表的头节点值，将较小的头节点连接到合并后的链表中
        if (left.val < right.val) {
            left.next = mergeTwoLists(left.next, right);
            return left;
        } else {
            right.next = mergeTwoLists(left, right.next);
            return right;
        }
    }
}
```

- 时间复杂度：考虑递归「向上回升」的过程——第一轮合并 k/2 组链表，每一组有两个链表，每个链表的长度是 n，所以合并两个有序链表的时间代价是 O(2n)；
第二轮合并 k/4 组链表，每一组也是两个链表，但每个链表的长度是2n，从而每组的时间代价是 O(4n)......
所以总的时间代价是 $O(\sum_{i = 1}^{\log_2 k} \frac{k}{2^i} \times 2^i n) = O(k n \times \log k)$，故渐进时间复杂度为 $O(kn×\log k)$。
- 空间复杂度：递归会使用到 $O(\log k)$ 空间代价的栈空间。
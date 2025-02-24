---
title: 前 K 个高频元素
createTime: 2025/02/24 18:48:41
permalink: /article/9tpg7w5h/
tags:
  - 堆
  - 哈希表
  - 历史信息
---
## [347. 前 K 个高频元素](https://leetcode.cn/problems/top-k-frequent-elements/)

给你一个整数数组 `nums` 和一个整数 `k` ，请你返回其中出现频率前 `k` 高的元素。你可以按 **任意顺序** 返回答案。

**示例 1:**

```
输入: nums = [1,1,1,2,2,3], k = 2
输出: [1,2]
```

**示例 2:**

```
输入: nums = [1], k = 1
输出: [1]
```

**提示：**

- `1 <= nums.length <= 10^5`
- `k` 的取值范围是 `[1, 数组中不相同的元素的个数]`
- 题目数据保证答案唯一，换句话说，数组中前 `k` 个高频元素的集合是唯一的

**进阶**：你所设计算法的时间复杂度 **必须** 优于 `O(n log n)` ，其中 `n` 是数组大小。

## 哈希表统计次数+小顶堆根据哈希表中记录的次数排序

优先级队列的特点：流式排序或者叫增量排序，本质上是利用历史信息进行排序，降低了直接排序的时间复杂度。
空间换时间。空间存历史信息，利用历史信息节约时间。

类似 215. 数组中的第 k 个最大元素。

```java
import java.util.*;

class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        // 利用哈希表记录每个数字出现的次数
        Map<Integer, Integer> occurrences = new HashMap<>();
        for (int num : nums) {
            occurrences.put(num, occurrences.getOrDefault(num, 0) + 1);
        }

        // 使用优先队列（小顶堆），int[] 的第一个元素代表数组的值，第二个元素代表该值出现的次数
        Queue<int[]> queue = new PriorityQueue<>(new Comparator<int[]>() {
            public int compare(int[] m, int[] n) {
                return m[1] - n[1]; // 比较频率，按频率升序排序
            }
        });

        // 遍历 occurrences 映射中的每个条目，将其添加到优先队列中。注意类型。
        // 也可以模仿 215. 数组中的第 k 个最大元素，无条件入队，大于 k 时再删除堆顶元素。
        for (Map.Entry<Integer, Integer> entry : occurrences.entrySet()) {
            int num = entry.getKey();
            int count = entry.getValue();

            // 如果优先队列已经有 k 个元素
            if (queue.size() == k) {
                // 如果当前数的频率大于优先队列的堆顶元素（最小频率），则替换堆顶元素
                if (queue.peek()[1] < count) {
                    queue.poll(); // 移除堆顶元素，即频率最小的元素，log k
                    queue.offer(new int[] {num, count}); // 添加当前数及其频率，log k
                }
            } else {
                // 如果优先队列还没有 k 个元素，直接添加当前数及其频率
                queue.offer(new int[]{num, count});
            }
        }

        // 提取优先队列中的元素，将其存入结果数组中
        int[] ret = new int[k];
        for (int i = 0; i < k; ++i) {
            ret[i] = queue.poll()[0]; // 取出优先队列的堆顶元素的值（频率最高的前 k 个元素）
        }

        return ret; // 返回结果数组
    }
}
```

- 时间复杂度： $O(N \log k)$ ，其中 $N$ 为数组的长度。我们首先遍历原数组，并使用哈希表记录出现次数，每个元素需要 $O(1)$ 的时间，共需 $O(N)$ 的时间。随后，我们遍历「出现次数数组」，由于堆的大小至多为 $k$ ，因此每次堆操作需要 $O(\log k)$ 的时间，共需 $O(N \log k)$ 的时间。二者之和为 $O(N \log k)$ 。
- 空间复杂度: $O(N)$ 。哈希表的大小为 $O(N)$ ，而堆的大小为 $O(k)$ ，共计为 $O(N)$ 。